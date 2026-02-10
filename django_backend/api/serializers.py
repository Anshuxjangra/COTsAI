from rest_framework import serializers
from parts.models import Component, ComponentSpecification, SelectionHistory, Cart


class ComponentSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComponentSpecification
        fields = '__all__'


class ComponentSerializer(serializers.ModelSerializer):
    specification = ComponentSpecificationSerializer(read_only=True)
    
    class Meta:
        model = Component
        fields = [
            'id', 'component_type', 'name', 'manufacturer', 'part_number',
            'price', 'availability', 'lead_time', 'rating', 'specifications',
            'pros', 'cons', 'alternatives', 'vendor_url', 'specification',
            'created_at', 'updated_at'
        ]


class SelectionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SelectionHistory
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'


class ComponentSelectionRequestSerializer(serializers.Serializer):
    """Serializer for component selection request"""
    component_type = serializers.CharField(max_length=20)
    form_data = serializers.JSONField()


class ComponentDownloadSerializer(serializers.Serializer):
    """Serializer for download specs request"""
    component_id = serializers.IntegerField()
    component_name = serializers.CharField(max_length=255)
    manufacturer = serializers.CharField(max_length=255)
    specifications = serializers.ListField(child=serializers.CharField())
    criteria_matches = serializers.ListField()
    performance_metrics = serializers.ListField()
    component_type = serializers.CharField(max_length=20)


class BOMDownloadSerializer(serializers.Serializer):
    """Serializer for BOM download request"""
    components = serializers.ListField()
    project_name = serializers.CharField(max_length=255)
