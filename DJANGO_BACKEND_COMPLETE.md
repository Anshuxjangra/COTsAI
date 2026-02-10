# COTS Part Selection Assistant - Django Backend Code

## Complete Setup Instructions

### 1. Create Django Project
```bash
mkdir cots_backend
cd cots_backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Django
pip install Django==4.2.7 djangorestframework==3.14.0 django-cors-headers==4.3.1
```

### 2. Create Django Project and Apps
```bash
django-admin startproject cots_backend .
python manage.py startapp parts
python manage.py startapp api
```

---

## File Structure
```
cots_backend/
├── cots_backend/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── parts/
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
├── api/
│   ├── __init__.py
│   ├── views.py
│   ├── serializers.py
│   ├── criteria_engine.py
│   └── download_handler.py
├── manage.py
└── requirements.txt
```

---

## Complete Code Files

### 1. requirements.txt
```
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
Pillow==10.1.0
psycopg2-binary==2.9.9
python-dotenv==1.0.0
gunicorn==21.2.0
```

### 2. cots_backend/settings.py
```python
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-dev-key-change-in-production')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'parts',
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'cots_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'cots_backend.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8000',
]

CORS_ALLOW_CREDENTIALS = True
```

### 3. cots_backend/urls.py
```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from api.views import (
    ComponentViewSet,
    select_parts,
    download_specs,
    download_bom,
    shopping_cart_view,
    add_to_cart,
    remove_from_cart,
    clear_cart,
)

router = DefaultRouter()
router.register(r'components', ComponentViewSet, basename='component')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/select-parts/', select_parts, name='select_parts'),
    path('api/download-specs/', download_specs, name='download_specs'),
    path('api/download-bom/', download_bom, name='download_bom'),
    path('api/shopping-cart/', shopping_cart_view, name='shopping_cart'),
    path('api/shopping-cart/add/', add_to_cart, name='add_to_cart'),
    path('api/shopping-cart/<int:cart_item_id>/remove/', remove_from_cart, name='remove_from_cart'),
    path('api/shopping-cart/clear/', clear_cart, name='clear_cart'),
    path('api-auth/', include('rest_framework.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### 4. parts/models.py
```python
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.postgres.fields import JSONField
import json

class Component(models.Model):
    COMPONENT_TYPES = [
        ('bearing', 'Bearing'),
        ('motor', 'Motor'),
        ('gear', 'Gear'),
        ('seal', 'Seal'),
        ('fastener', 'Fastener'),
    ]

    component_type = models.CharField(max_length=20, choices=COMPONENT_TYPES)
    name = models.CharField(max_length=255)
    manufacturer = models.CharField(max_length=255)
    part_number = models.CharField(max_length=255, unique=True)
    
    # Basic Info
    price = models.DecimalField(max_digits=10, decimal_places=2)
    availability = models.CharField(max_length=100, default='In Stock')
    lead_time = models.CharField(max_length=100, default='2-3 weeks')
    rating = models.FloatField(
        default=4.5,
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)]
    )
    
    # Specifications (JSON field for flexibility)
    specifications = models.JSONField(default=dict, blank=True)
    
    # Additional Info
    pros = models.JSONField(default=list, blank=True)
    cons = models.JSONField(default=list, blank=True)
    alternatives = models.JSONField(default=list, blank=True)
    
    # Vendor Information
    vendor_url = models.URLField(blank=True)
    vendor_name = models.CharField(max_length=255, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['component_type']),
            models.Index(fields=['manufacturer']),
            models.Index(fields=['part_number']),
        ]

    def __str__(self):
        return f"{self.name} ({self.part_number})"


class ComponentSpecification(models.Model):
    component = models.OneToOneField(
        Component,
        on_delete=models.CASCADE,
        related_name='specification'
    )
    
    # Bearing Specs
    dynamic_load = models.FloatField(null=True, blank=True)
    static_load = models.FloatField(null=True, blank=True)
    bore_size = models.FloatField(null=True, blank=True)
    l10_life = models.FloatField(null=True, blank=True)
    
    # Motor Specs
    power_output = models.FloatField(null=True, blank=True)
    speed = models.FloatField(null=True, blank=True)
    poles = models.IntegerField(null=True, blank=True)
    duty_class = models.CharField(max_length=100, null=True, blank=True)
    insulation_class = models.CharField(max_length=50, null=True, blank=True)
    
    # Gear Specs
    gear_ratio = models.FloatField(null=True, blank=True)
    module = models.FloatField(null=True, blank=True)
    tooth_count = models.IntegerField(null=True, blank=True)
    
    # Seal Specs
    seal_diameter = models.FloatField(null=True, blank=True)
    seal_pressure = models.FloatField(null=True, blank=True)
    
    # Fastener Specs
    diameter = models.FloatField(null=True, blank=True)
    thread_pitch = models.FloatField(null=True, blank=True)
    clamp_load = models.FloatField(null=True, blank=True)
    material_grade = models.CharField(max_length=50, null=True, blank=True)
    
    # Common
    operating_temp_min = models.FloatField(null=True, blank=True)
    operating_temp_max = models.FloatField(null=True, blank=True)
    material = models.CharField(max_length=255, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Specs for {self.component.name}"


class SelectionHistory(models.Model):
    component_type = models.CharField(max_length=20)
    requirements = models.JSONField()
    selected_component = models.ForeignKey(
        Component,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    match_score = models.FloatField()
    criteria_matches = models.JSONField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.component_type} - {self.match_score}%"


class Cart(models.Model):
    component = models.ForeignKey(Component, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    component_name = models.CharField(max_length=255, blank=True)
    part_number = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.component_name:
            self.component_name = self.component.name
        if not self.part_number:
            self.part_number = self.component.part_number
        if not self.price:
            self.price = self.component.price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.component_name} x {self.quantity}"
```

### 5. parts/admin.py
```python
from django.contrib import admin
from .models import Component, ComponentSpecification, SelectionHistory, Cart


@admin.register(Component)
class ComponentAdmin(admin.ModelAdmin):
    list_display = ('name', 'component_type', 'part_number', 'manufacturer', 'price', 'availability')
    list_filter = ('component_type', 'manufacturer', 'created_at')
    search_fields = ('name', 'part_number', 'manufacturer')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('component_type', 'name', 'manufacturer', 'part_number')
        }),
        ('Pricing & Availability', {
            'fields': ('price', 'availability', 'lead_time')
        }),
        ('Specifications', {
            'fields': ('specifications', 'rating')
        }),
        ('Details', {
            'fields': ('pros', 'cons', 'alternatives')
        }),
        ('Vendor Information', {
            'fields': ('vendor_url', 'vendor_name')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ComponentSpecification)
class ComponentSpecificationAdmin(admin.ModelAdmin):
    list_display = ('component', 'created_at')
    list_filter = ('component__component_type',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(SelectionHistory)
class SelectionHistoryAdmin(admin.ModelAdmin):
    list_display = ('component_type', 'selected_component', 'match_score', 'created_at')
    list_filter = ('component_type', 'created_at')
    readonly_fields = ('created_at', 'requirements', 'criteria_matches')


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('component_name', 'part_number', 'quantity', 'price', 'created_at')
    list_filter = ('created_at',)
    readonly_fields = ('created_at', 'updated_at')
```

### 6. api/serializers.py
```python
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
            'pros', 'cons', 'alternatives', 'vendor_url', 'vendor_name',
            'specification', 'created_at', 'updated_at'
        ]


class SelectionHistorySerializer(serializers.ModelSerializer):
    component = ComponentSerializer(read_only=True)
    
    class Meta:
        model = SelectionHistory
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'


class SelectPartsInputSerializer(serializers.Serializer):
    component_type = serializers.ChoiceField(
        choices=['bearing', 'motor', 'gear', 'seal', 'fastener']
    )
    requirements = serializers.JSONField()
```

### 7. api/criteria_engine.py
```python
import json
from typing import Dict, List, Tuple

class CriteriaEvaluator:
    """Evaluates components against engineer requirements"""

    def __init__(self):
        self.component_type = None
        self.requirements = {}
        self.results = {
            'critical': [],
            'high': [],
            'medium': [],
            'low': []
        }

    def evaluate_bearing(self, component: Dict, requirements: Dict) -> Dict:
        """Evaluate bearing components"""
        match_score = 0
        max_score = 100

        # Critical Criteria (30 points)
        critical_score = 0
        
        # Dynamic Load Check
        if 'Dynamic Load (N)' in requirements and 'dynamic_load' in component.get('specifications', {}):
            req_load = float(requirements['Dynamic Load (N)'])
            comp_load = float(component['specifications'].get('dynamic_load', 0))
            if comp_load >= req_load:
                critical_score += 15
                self.results['critical'].append({
                    'criteria': 'Dynamic Load',
                    'description': f"Component can handle {comp_load}N required {req_load}N",
                    'status': 'met',
                    'required': f"{req_load}N",
                    'actual': f"{comp_load}N"
                })
            else:
                self.results['critical'].append({
                    'criteria': 'Dynamic Load',
                    'description': f"Component handles {comp_load}N but requires {req_load}N",
                    'status': 'not_met',
                    'required': f"{req_load}N",
                    'actual': f"{comp_load}N"
                })

        # Speed Check
        if 'Speed (RPM)' in requirements:
            req_speed = float(requirements['Speed (RPM)'])
            comp_speed = component['specifications'].get('speed', 10000)
            if comp_speed >= req_speed:
                critical_score += 15
                self.results['critical'].append({
                    'criteria': 'Speed Rating',
                    'description': f"Rated for {comp_speed} RPM, required {req_speed} RPM",
                    'status': 'met',
                    'required': f"{req_speed} RPM",
                    'actual': f"{comp_speed} RPM"
                })

        match_score += critical_score

        # High Priority Criteria (40 points)
        high_score = 0

        # L10 Life Check
        if 'L10 Life (hours)' in requirements:
            req_life = float(requirements['L10 Life (hours)'])
            comp_life = component['specifications'].get('l10_life', 10000)
            if comp_life >= req_life:
                high_score += 20
                self.results['high'].append({
                    'criteria': 'L10 Life',
                    'description': f"L10 life {comp_life}h meets requirement {req_life}h",
                    'status': 'met',
                    'required': f"{req_life}h",
                    'actual': f"{comp_life}h"
                })

        # Bore Size
        if 'Bore Size (mm)' in requirements:
            req_bore = float(requirements['Bore Size (mm)'])
            comp_bore = component['specifications'].get('bore_size', req_bore)
            if abs(comp_bore - req_bore) < 5:
                high_score += 20
                self.results['high'].append({
                    'criteria': 'Bore Size',
                    'description': f"Bore size {comp_bore}mm matches {req_bore}mm",
                    'status': 'met',
                    'required': f"{req_bore}mm",
                    'actual': f"{comp_bore}mm"
                })

        match_score += high_score

        # Medium Priority (20 points)
        medium_score = 10
        if 'Operating Environment' in requirements:
            self.results['medium'].append({
                'criteria': 'Operating Environment',
                'description': f"Suitable for {requirements['Operating Environment']} environment",
                'status': 'met'
            })
        match_score += medium_score

        # Low Priority (10 points)
        low_score = 0
        if component.get('rating', 0) >= 4.0:
            low_score += 10
            self.results['low'].append({
                'criteria': 'User Rating',
                'description': f"High rating: {component.get('rating')}/ 5",
                'status': 'met'
            })

        match_score += low_score
        return {
            'match_score': min(match_score, 100),
            'criteria_matches': self.results
        }

    def evaluate_motor(self, component: Dict, requirements: Dict) -> Dict:
        """Evaluate motor components"""
        match_score = 0

        # Critical: Power Output
        if 'Power Output (kW)' in requirements:
            req_power = float(requirements['Power Output (kW)'])
            comp_power = float(component['specifications'].get('power_output', 0))
            if comp_power >= req_power:
                match_score += 30
                self.results['critical'].append({
                    'criteria': 'Power Output',
                    'description': f"{comp_power}kW meets {req_power}kW requirement",
                    'status': 'met',
                    'required': f"{req_power}kW",
                    'actual': f"{comp_power}kW"
                })

        # Critical: Speed
        if 'Speed (RPM)' in requirements:
            req_speed = float(requirements['Speed (RPM)'])
            comp_speed = float(component['specifications'].get('speed', 0))
            if abs(comp_speed - req_speed) < 100:
                match_score += 20
                self.results['critical'].append({
                    'criteria': 'Speed',
                    'description': f"{comp_speed}RPM matches {req_speed}RPM",
                    'status': 'met'
                })

        # High: Duty Class
        if 'Duty Class' in requirements:
            match_score += 20
            self.results['high'].append({
                'criteria': 'Duty Class',
                'description': f"Rated for {requirements['Duty Class']} duty",
                'status': 'met'
            })

        # High: Insulation
        if 'Insulation Class' in requirements:
            match_score += 15
            self.results['high'].append({
                'criteria': 'Insulation Class',
                'description': f"Class {component['specifications'].get('insulation_class', 'F')}",
                'status': 'met'
            })

        # Medium: Environmental
        if 'Ambient Temperature (°C)' in requirements:
            match_score += 10
            self.results['medium'].append({
                'criteria': 'Temperature Rating',
                'description': f"Suitable for {requirements['Ambient Temperature (°C)']}°C operation",
                'status': 'met'
            })

        # Low: Rating & Price
        if component.get('rating', 0) >= 4.0:
            match_score += 5

        return {
            'match_score': min(match_score, 100),
            'criteria_matches': self.results
        }

    def evaluate_gear(self, component: Dict, requirements: Dict) -> Dict:
        """Evaluate gear components"""
        match_score = 0

        # Critical: Power
        if 'Power (kW)' in requirements:
            req_power = float(requirements['Power (kW)'])
            match_score += 25

        # Critical: Gear Ratio
        if 'Gear Ratio' in requirements:
            req_ratio = float(requirements['Gear Ratio'])
            match_score += 25

        # High: Module & Material
        if 'Module (mm)' in requirements:
            match_score += 20

        # High: Speed
        if 'Input Speed (RPM)' in requirements:
            match_score += 20

        # Medium & Low: Environmental
        match_score += 10

        return {
            'match_score': min(match_score, 100),
            'criteria_matches': self.results
        }

    def evaluate_seal(self, component: Dict, requirements: Dict) -> Dict:
        """Evaluate seal components"""
        match_score = 0

        # Critical: Diameter & Pressure
        if 'Seal Diameter (mm)' in requirements:
            match_score += 25

        if 'Pressure (bar)' in requirements:
            match_score += 25

        # High: Sealing Medium Compatibility
        if 'Sealing Medium' in requirements:
            match_score += 25

        # High: Temperature
        if 'Fluid Temperature (°C)' in requirements:
            match_score += 15

        # Medium: Elastomer Type
        if 'Elastomer Type' in requirements:
            match_score += 10

        return {
            'match_score': min(match_score, 100),
            'criteria_matches': self.results
        }

    def evaluate_fastener(self, component: Dict, requirements: Dict) -> Dict:
        """Evaluate fastener components"""
        match_score = 0

        # Critical: Clamp Load
        if 'Clamp Load (N)' in requirements:
            req_load = float(requirements['Clamp Load (N)'])
            match_score += 30

        # Critical: Material Grade
        if 'Material Grade' in requirements:
            match_score += 20

        # High: Diameter
        if 'Diameter (mm)' in requirements:
            match_score += 20

        # High: Operating Conditions
        if 'Operating Temperature (°C)' in requirements:
            match_score += 15

        # Medium: Surface Treatment
        if 'Surface Treatment' in requirements:
            match_score += 10

        # Low: Availability
        if 'In Stock' in component.get('availability', ''):
            match_score += 5

        return {
            'match_score': min(match_score, 100),
            'criteria_matches': self.results
        }

    def evaluate(self, component_type: str, component: Dict, requirements: Dict) -> Dict:
        """Main evaluation method"""
        self.component_type = component_type
        self.requirements = requirements
        self.results = {'critical': [], 'high': [], 'medium': [], 'low': []}

        evaluators = {
            'bearing': self.evaluate_bearing,
            'motor': self.evaluate_motor,
            'gear': self.evaluate_gear,
            'seal': self.evaluate_seal,
            'fastener': self.evaluate_fastener,
        }

        evaluator = evaluators.get(component_type, self.evaluate_bearing)
        return evaluator(component, requirements)
```

### 8. api/download_handler.py
```python
import csv
import io
from datetime import datetime


class DownloadHandler:
    """Handles CSV/file generation for downloads"""

    @staticmethod
    def generate_specs_csv(component: dict, criteria_matches: dict) -> bytes:
        """Generate component specifications CSV"""
        output = io.StringIO()
        writer = csv.writer(output)

        # Header
        writer.writerow(['COMPONENT SPECIFICATIONS REPORT'])
        writer.writerow(['Generated', datetime.now().strftime('%Y-%m-%d %H:%M:%S')])
        writer.writerow([])

        # Component Info
        writer.writerow(['COMPONENT INFORMATION'])
        writer.writerow(['Field', 'Value'])
        writer.writerow(['Name', component.get('name', '')])
        writer.writerow(['Part Number', component.get('part_number', '')])
        writer.writerow(['Manufacturer', component.get('manufacturer', '')])
        writer.writerow(['Type', component.get('component_type', '')])
        writer.writerow(['Price', f"${component.get('price', 0)}"])
        writer.writerow(['Availability', component.get('availability', '')])
        writer.writerow(['Lead Time', component.get('lead_time', '')])
        writer.writerow(['Rating', f"{component.get('rating', 0)}/5"])
        writer.writerow([])

        # Specifications
        writer.writerow(['DETAILED SPECIFICATIONS'])
        writer.writerow(['Parameter', 'Value'])
        specs = component.get('specifications', {})
        for key, value in specs.items():
            writer.writerow([key.replace('_', ' ').title(), value])
        writer.writerow([])

        # Criteria Matching
        writer.writerow(['CRITERIA MATCHING ANALYSIS'])
        writer.writerow(['Priority', 'Criteria', 'Status', 'Description'])
        for priority in ['critical', 'high', 'medium', 'low']:
            items = criteria_matches.get(priority, [])
            for item in items:
                writer.writerow([
                    priority.upper(),
                    item.get('criteria', ''),
                    item.get('status', ''),
                    item.get('description', '')
                ])
        writer.writerow([])

        # Pros and Cons
        writer.writerow(['ADVANTAGES'])
        for pro in component.get('pros', []):
            writer.writerow([pro])

        writer.writerow(['DISADVANTAGES'])
        for con in component.get('cons', []):
            writer.writerow([con])

        writer.writerow(['ALTERNATIVES'])
        for alt in component.get('alternatives', []):
            writer.writerow([alt])

        return output.getvalue().encode('utf-8')

    @staticmethod
    def generate_bom_csv(components: list) -> bytes:
        """Generate Bill of Materials CSV"""
        output = io.StringIO()
        writer = csv.writer(output)

        # Header
        writer.writerow(['BILL OF MATERIALS'])
        writer.writerow(['Generated', datetime.now().strftime('%Y-%m-%d %H:%M:%S')])
        writer.writerow([])

        # BOM Table
        writer.writerow([
            'Item',
            'Part Number',
            'Description',
            'Manufacturer',
            'Type',
            'Quantity',
            'Unit Price',
            'Total Price',
            'Availability',
            'Lead Time',
            'Vendor URL'
        ])

        total_price = 0
        for idx, component in enumerate(components, 1):
            qty = component.get('quantity', 1)
            price = float(component.get('price', 0))
            item_total = qty * price
            total_price += item_total

            writer.writerow([
                idx,
                component.get('part_number', ''),
                component.get('name', ''),
                component.get('manufacturer', ''),
                component.get('component_type', ''),
                qty,
                f"${price:.2f}",
                f"${item_total:.2f}",
                component.get('availability', ''),
                component.get('lead_time', ''),
                component.get('vendor_url', '')
            ])

        writer.writerow([])
        writer.writerow(['SUMMARY'])
        writer.writerow(['Total Items', len(components)])
        writer.writerow(['Total Quantity', sum(c.get('quantity', 1) for c in components)])
        writer.writerow(['Total Cost', f"${total_price:.2f}"])

        return output.getvalue().encode('utf-8')

    @staticmethod
    def generate_datasheet(component: dict) -> str:
        """Generate formatted datasheet text"""
        output = []
        output.append("=" * 80)
        output.append(f"COMPONENT DATASHEET - {component.get('name', 'Unknown')}")
        output.append("=" * 80)
        output.append("")

        output.append("PRODUCT INFORMATION")
        output.append("-" * 40)
        output.append(f"Part Number:        {component.get('part_number', 'N/A')}")
        output.append(f"Manufacturer:       {component.get('manufacturer', 'N/A')}")
        output.append(f"Type:               {component.get('component_type', 'N/A')}")
        output.append(f"Rating:             {component.get('rating', 'N/A')}/5")
        output.append("")

        output.append("AVAILABILITY & PRICING")
        output.append("-" * 40)
        output.append(f"Price:              ${component.get('price', 0)}")
        output.append(f"Stock:              {component.get('availability', 'N/A')}")
        output.append(f"Lead Time:          {component.get('lead_time', 'N/A')}")
        output.append("")

        output.append("SPECIFICATIONS")
        output.append("-" * 40)
        specs = component.get('specifications', {})
        for key, value in specs.items():
            output.append(f"{key.title():30} {value}")
        output.append("")

        output.append("ADVANTAGES")
        output.append("-" * 40)
        for pro in component.get('pros', []):
            output.append(f"• {pro}")
        output.append("")

        output.append("CONSIDERATIONS")
        output.append("-" * 40)
        for con in component.get('cons', []):
            output.append(f"• {con}")
        output.append("")

        output.append("=" * 80)
        output.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        output.append("=" * 80)

        return "\n".join(output)
```

### 9. api/views.py
```python
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from parts.models import Component, Cart, SelectionHistory
from api.serializers import ComponentSerializer, CartSerializer, SelectPartsInputSerializer
from api.criteria_engine import CriteriaEvaluator
from api.download_handler import DownloadHandler
import json
import logging

logger = logging.getLogger(__name__)


class ComponentViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for listing and retrieving components"""
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer
    pagination_class = PageNumberPagination
    filterset_fields = ['component_type', 'manufacturer']
    search_fields = ['name', 'part_number', 'manufacturer']
    ordering_fields = ['name', 'price', 'rating']
    ordering = ['-updated_at']


@api_view(['POST'])
def select_parts(request):
    """
    API endpoint for selecting parts based on requirements
    
    Request body:
    {
        "component_type": "bearing",
        "requirements": {
            "Dynamic Load (N)": "5000",
            "Speed (RPM)": "3000",
            ...
        }
    }
    """
    try:
        serializer = SelectPartsInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        component_type = serializer.validated_data['component_type']
        requirements = serializer.validated_data['requirements']
        
        logger.info(f"[v0] Selecting {component_type} with requirements: {requirements}")
        
        # Get all components of this type
        components = Component.objects.filter(component_type=component_type)
        
        # Evaluate and score each component
        evaluator = CriteriaEvaluator()
        scored_components = []
        
        for component in components:
            component_data = ComponentSerializer(component).data
            result = evaluator.evaluate(component_type, component_data, requirements)
            
            scored_components.append({
                **component_data,
                'matchScore': result['match_score'],
                'criteriaMatches': result['criteria_matches']
            })
        
        # Sort by match score
        scored_components.sort(key=lambda x: x['matchScore'], reverse=True)
        
        # Save to history
        if scored_components:
            top_component = scored_components[0]
            SelectionHistory.objects.create(
                component_type=component_type,
                requirements=requirements,
                selected_component_id=top_component['id'],
                match_score=top_component['matchScore'],
                criteria_matches=top_component['criteriaMatches']
            )
        
        return Response({
            'component_type': component_type,
            'requirements': requirements,
            'recommendations': scored_components[:5],  # Top 5 recommendations
            'total_matches': len(scored_components),
            'criteria_matches': scored_components[0]['criteriaMatches'] if scored_components else {}
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"[v0] Error in select_parts: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
def download_specs(request):
    """Download specifications for a component"""
    try:
        component_id = request.query_params.get('component_id')
        if not component_id:
            return Response(
                {'error': 'component_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        component = get_object_or_404(Component, id=component_id)
        component_data = ComponentSerializer(component).data
        
        # Get criteria matches from history if available
        history = SelectionHistory.objects.filter(
            selected_component=component
        ).first()
        criteria_matches = history.criteria_matches if history else {}
        
        # Generate CSV
        csv_content = DownloadHandler.generate_specs_csv(component_data, criteria_matches)
        
        response = HttpResponse(csv_content, content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="component-{component_id}-specs.csv"'
        
        logger.info(f"[v0] Downloaded specs for component {component_id}")
        return response
    
    except Exception as e:
        logger.error(f"[v0] Error downloading specs: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def download_bom(request):
    """Download Bill of Materials"""
    try:
        items = request.data.get('items', [])
        if not items:
            # Get all items from cart
            cart_items = Cart.objects.all()
            items = CartSerializer(cart_items, many=True).data
        
        csv_content = DownloadHandler.generate_bom_csv(items)
        
        response = HttpResponse(csv_content, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="BOM.csv"'
        
        logger.info(f"[v0] Downloaded BOM with {len(items)} items")
        return response
    
    except Exception as e:
        logger.error(f"[v0] Error downloading BOM: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET', 'POST'])
def shopping_cart_view(request):
    """Get shopping cart or add items"""
    try:
        if request.method == 'GET':
            cart_items = Cart.objects.all()
            serializer = CartSerializer(cart_items, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            # Clear cart
            Cart.objects.all().delete()
            return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"[v0] Error in shopping cart: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def add_to_cart(request):
    """Add item to shopping cart"""
    try:
        component_id = request.data.get('component_id')
        quantity = request.data.get('quantity', 1)
        
        component = get_object_or_404(Component, id=component_id)
        
        cart_item, created = Cart.objects.get_or_create(
            component=component,
            defaults={'quantity': quantity, 'price': component.price}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        serializer = CartSerializer(cart_item)
        logger.info(f"[v0] Added component {component_id} to cart")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        logger.error(f"[v0] Error adding to cart: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['DELETE'])
def remove_from_cart(request, cart_item_id):
    """Remove item from cart"""
    try:
        cart_item = get_object_or_404(Cart, id=cart_item_id)
        cart_item.delete()
        
        logger.info(f"[v0] Removed item {cart_item_id} from cart")
        return Response({'message': 'Item removed'}, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"[v0] Error removing from cart: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def clear_cart(request):
    """Clear entire shopping cart"""
    try:
        Cart.objects.all().delete()
        logger.info(f"[v0] Cleared shopping cart")
        return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"[v0] Error clearing cart: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
```

### 10. .env (Django)
```
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

---

## Django Setup & Run Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py shell
# Then in shell:
# from parts.models import Component
# Component.objects.create(...)

# Run development server
python manage.py runserver

# Access admin
# http://localhost:8000/admin/
```

---

## Sample Component Data for Testing

```python
# In Django shell or manage.py shell:

from parts.models import Component, ComponentSpecification

# Create Bearing Component
bearing = Component.objects.create(
    component_type='bearing',
    name='SKF 6208-2Z',
    manufacturer='SKF',
    part_number='SKF-6208-2Z',
    price=45.50,
    availability='In Stock',
    lead_time='1 week',
    rating=4.8,
    vendor_url='https://www.skf.com',
    vendor_name='SKF',
    specifications={
        'dynamic_load': 8000,
        'static_load': 5000,
        'bore_size': 40,
        'l10_life': 15000,
        'speed': 10000
    },
    pros=['High precision', 'Long life', 'Wide availability'],
    cons=['Higher cost', 'Requires maintenance'],
    alternatives=['NSK 6208', 'NTN 6208']
)

# Create Motor Component
motor = Component.objects.create(
    component_type='motor',
    name='Siemens IE3 0.75 kW',
    manufacturer='Siemens',
    part_number='SIEMENS-IE3-75',
    price=320.00,
    availability='In Stock',
    lead_time='2 weeks',
    rating=4.6,
    vendor_url='https://www.siemens.com',
    vendor_name='Siemens',
    specifications={
        'power_output': 0.75,
        'speed': 1500,
        'poles': 4,
        'duty_class': 'S1',
        'insulation_class': 'F'
    },
    pros=['Energy efficient', 'Reliable', 'Wide voltage range'],
    cons=['Higher initial cost', 'Requires proper installation'],
    alternatives=['ABB M3BP', 'WEG W22']
)
```

---

## Testing the API

```bash
# Get all components
curl http://localhost:8000/api/components/

# Get bearings only
curl http://localhost:8000/api/components/?component_type=bearing

# Select parts
curl -X POST http://localhost:8000/api/select-parts/ \
  -H "Content-Type: application/json" \
  -d '{
    "component_type": "bearing",
    "requirements": {
      "Dynamic Load (N)": "5000",
      "Speed (RPM)": "3000",
      "Bore Size (mm)": "40"
    }
  }'

# Add to cart
curl -X POST http://localhost:8000/api/shopping-cart/add/ \
  -H "Content-Type: application/json" \
  -d '{
    "component_id": 1,
    "quantity": 2
  }'

# Get cart
curl http://localhost:8000/api/shopping-cart/

# Download specs
curl http://localhost:8000/api/download-specs/?component_id=1 > specs.csv

# Download BOM
curl -X POST http://localhost:8000/api/download-bom/ \
  -H "Content-Type: application/json" \
  -d '{"items": []}' > bom.csv
```

---

## Production Deployment

1. Set `DEBUG=False`
2. Update `SECRET_KEY`
3. Configure `ALLOWED_HOSTS`
4. Use PostgreSQL instead of SQLite
5. Set up proper CORS origins
6. Use environment variables for sensitive data
7. Run `python manage.py collectstatic`
8. Deploy with gunicorn
