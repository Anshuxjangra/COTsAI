from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
from django.db.models import Q
from parts.models import Component, ComponentSpecification, SelectionHistory, Cart
from api.serializers import (
    ComponentSerializer,
    SelectionHistorySerializer,
    CartSerializer,
    ComponentSelectionRequestSerializer,
)
from api.criteria_engine import evaluate_criteria
from api.download_handler import generate_specs_csv, generate_bom_csv
from datetime import datetime


class ComponentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for listing and filtering COTS components
    
    Query parameters:
    - component_type: Filter by type (bearing, motor, gear, seal, fastener)
    - manufacturer: Filter by manufacturer
    - search: Search by name or part number
    - ordering: Order by rating, price, created_at (default: -rating)
    """
    serializer_class = ComponentSerializer
    filterset_fields = ['component_type', 'manufacturer']
    search_fields = ['name', 'part_number', 'manufacturer']
    ordering_fields = ['rating', 'created_at']
    ordering = ['-rating']
    
    def get_queryset(self):
        queryset = Component.objects.prefetch_related('specification')
        
        # Additional filtering
        component_type = self.request.query_params.get('component_type')
        if component_type:
            queryset = queryset.filter(component_type=component_type)
        
        return queryset


@api_view(['POST'])
def select_parts(request):
    """
    Select COTS components based on engineering requirements
    
    Request body:
    {
        "componentType": "bearing|motor|gear|seal|fastener",
        "dynamicLoad": 25,
        "speed": 5000,
        "boreSize": 40,
        "bearingEnvironment": "Clean/Sealed",
        "lubrication": "Grease",
        "bearingMaterial": "Steel",
        ...other component-specific parameters
    }
    
    Returns top 3 matching components with criteria evaluation and match scores
    """
    try:
        form_data = request.data
        component_type = form_data.get('componentType')
        
        if not component_type:
            return Response(
                {'error': 'componentType is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get all components of this type
        components = Component.objects.filter(
            component_type=component_type.lower()
        ).prefetch_related('specification')
        
        if not components.exists():
            return Response(
                {'error': f'No components found for type: {component_type}'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Evaluate each component against criteria
        recommendations = []
        
        for component in components:
            spec = component.specification
            if not spec:
                continue
            
            # Evaluate criteria
            evaluation = evaluate_criteria(component_type, form_data, spec)
            
            # Build recommendation object
            recommendation = {
                'id': component.id,
                'name': component.name,
                'manufacturer': component.manufacturer,
                'partNumber': component.part_number,
                'price': component.price,
                'availability': component.availability,
                'leadTime': component.lead_time,
                'rating': component.rating,
                'vendorUrl': component.vendor_url,
                'specifications': component.specifications,
                'pros': component.pros,
                'cons': component.cons,
                'alternatives': component.alternatives,
                'matchScore': evaluation['match_score'],
                'criteriaMatches': evaluation['criteria'],
                'performanceMetrics': get_performance_metrics(component_type, form_data, spec),
            }
            
            recommendations.append(recommendation)
        
        # Sort by match score and return top 3
        recommendations.sort(key=lambda x: x['matchScore'], reverse=True)
        top_recommendations = recommendations[:3]
        
        # Save to selection history
        if top_recommendations:
            SelectionHistory.objects.create(
                component_type=component_type.lower(),
                form_data=form_data,
                selected_component_id=top_recommendations[0]['id'],
                match_score=top_recommendations[0]['matchScore'],
                criteria_matches=top_recommendations[0]['criteriaMatches']
            )
        
        return Response({
            'recommendations': top_recommendations,
            'totalMatches': len(recommendations),
            'timestamp': datetime.now().isoformat(),
        })
        
    except Exception as e:
        return Response(
            {'error': f'Error processing request: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def get_performance_metrics(component_type, form_data, spec):
    """Generate performance metrics for component"""
    metrics_map = {
        'bearing': [
            {
                'label': 'Dynamic Load Capacity vs Requirement',
                'value': f'{spec.dynamic_load_rating or 0} kN',
                'target': f'{form_data.get("dynamicLoad", 0)} kN',
                'met': (spec.dynamic_load_rating or 0) >= float(form_data.get("dynamicLoad", 0))
            },
            {
                'label': 'Speed Rating',
                'value': f'{spec.speed_rating or 0} RPM',
                'target': f'{form_data.get("speed", 0)} RPM',
                'met': (spec.speed_rating or 0) >= float(form_data.get("speed", 0))
            },
            {
                'label': 'L10 Life',
                'value': f'{spec.l10_life or 0} hours',
                'target': f'{form_data.get("targetL10Life", 0)} hours',
                'met': (spec.l10_life or 0) >= float(form_data.get("targetL10Life", 0))
            },
        ],
        'motor': [
            {
                'label': 'Power Output Efficiency',
                'value': f'{spec.efficiency or 85.3}%',
                'target': '≥80%',
                'met': True
            },
            {
                'label': 'Speed Match',
                'value': f'{spec.speed or 0} RPM',
                'target': f'{form_data.get("speed", 0)} RPM',
                'met': (spec.speed or 0) == float(form_data.get("speed", 0))
            },
            {
                'label': 'Thermal Capability',
                'value': f'{spec.insulation_class or "F"} class insulation',
                'target': 'Class F insulation',
                'met': True
            },
        ],
        'gear': [
            {
                'label': 'Power Transmission',
                'value': f'{spec.power_transmission or 15} kW',
                'target': f'{form_data.get("power", 0)} kW',
                'met': (spec.power_transmission or 15) >= float(form_data.get("power", 0))
            },
            {
                'label': 'Module Precision',
                'value': f'{spec.precision_grade or "ISO 7"} grade',
                'target': 'High precision',
                'met': True
            },
            {
                'label': 'Material Quality',
                'value': f'{spec.gear_material or "Steel"}',
                'target': 'High-strength material',
                'met': True
            },
        ],
        'seal': [
            {
                'label': 'Pressure Rating',
                'value': f'{spec.pressure_rating or 50} bar',
                'target': f'{form_data.get("pressure", 0)} bar',
                'met': (spec.pressure_rating or 50) >= float(form_data.get("pressure", 0))
            },
            {
                'label': 'Leakage Rate',
                'value': '<0.1 cc/hour',
                'target': 'Zero leak',
                'met': True
            },
            {
                'label': 'Elastomer Durability',
                'value': '5 years min',
                'target': 'Long-term reliability',
                'met': True
            },
        ],
        'fastener': [
            {
                'label': 'Tensile Strength',
                'value': f'{spec.tensile_strength or 800} MPa',
                'target': 'High-strength required',
                'met': True
            },
            {
                'label': 'Clamp Load Capacity',
                'value': f'{spec.clamp_load_capacity or 12000} N',
                'target': f'{form_data.get("clampLoad", 0)} N',
                'met': (spec.clamp_load_capacity or 12000) >= float(form_data.get("clampLoad", 0))
            },
            {
                'label': 'Corrosion Resistance',
                'value': 'Zinc-plated',
                'target': f'{form_data.get("fastenerEnvironment", "Dry")}',
                'met': True
            },
        ]
    }
    
    return metrics_map.get(component_type.lower(), [])


@api_view(['POST'])
def download_specs(request):
    """
    Download component specifications as CSV
    
    Request body:
    {
        "componentId": 1,
        "componentName": "Deep Groove Ball Bearing 6008",
        "manufacturer": "SKF",
        "specifications": [...],
        "criteriaMatches": [...],
        "performanceMetrics": [...],
        "componentType": "bearing"
    }
    """
    try:
        data = request.data
        
        csv_content = generate_specs_csv(data)
        
        response = HttpResponse(csv_content, content_type='text/csv')
        response['Content-Disposition'] = (
            f'attachment; filename="{data.get("componentName", "specs")}'
            f'-{datetime.now().timestamp()}.csv"'
        )
        
        return response
        
    except Exception as e:
        return Response(
            {'error': f'Failed to generate specs: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def download_bom(request):
    """
    Download Bill of Materials (BOM) as CSV
    
    Request body:
    {
        "projectName": "Project Name",
        "components": [
            {
                "id": 1,
                "name": "Component Name",
                "manufacturer": "Manufacturer",
                "partNumber": "PN-123",
                "quantity": 2,
                "price": "$25-35",
                "availability": "In Stock",
                "leadTime": "2-3 weeks",
                "vendorUrl": "https://..."
            },
            ...
        ]
    }
    """
    try:
        data = request.data
        
        csv_content = generate_bom_csv(data)
        
        response = HttpResponse(csv_content, content_type='text/csv')
        response['Content-Disposition'] = (
            f'attachment; filename="BOM-{data.get("projectName", "project")}'
            f'-{datetime.now().timestamp()}.csv"'
        )
        
        return response
        
    except Exception as e:
        return Response(
            {'error': f'Failed to generate BOM: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST', 'GET', 'DELETE'])
def shopping_cart(request, session_id=None):
    """
    Shopping cart management
    
    GET: Retrieve cart
    POST: Add component to cart
    DELETE: Remove from cart
    """
    session_id = request.query_params.get('session_id') or session_id or 'default'
    
    try:
        if request.method == 'GET':
            cart, created = Cart.objects.get_or_create(session_id=session_id)
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            cart, created = Cart.objects.get_or_create(session_id=session_id)
            component_data = request.data
            
            cart.components.append({
                'component_id': component_data.get('component_id'),
                'name': component_data.get('name'),
                'quantity': component_data.get('quantity', 1),
                'price': component_data.get('price'),
                'manufacturer': component_data.get('manufacturer'),
            })
            cart.save()
            
            serializer = CartSerializer(cart)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        elif request.method == 'DELETE':
            component_id = request.query_params.get('component_id')
            cart = Cart.objects.get(session_id=session_id)
            
            cart.components = [
                c for c in cart.components
                if c.get('component_id') != int(component_id)
            ]
            cart.save()
            
            serializer = CartSerializer(cart)
            return Response(serializer.data)
    
    except Cart.DoesNotExist:
        return Response(
            {'error': 'Cart not found'},
            status=status.HTTP_404_NOT_FOUND
        )
