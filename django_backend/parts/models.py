from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class ComponentType(models.TextChoices):
    BEARING = 'bearing', 'Bearing'
    MOTOR = 'motor', 'Motor'
    GEAR = 'gear', 'Gear'
    SEAL = 'seal', 'Seal'
    FASTENER = 'fastener', 'Fastener'


class Component(models.Model):
    # Basic Info
    component_type = models.CharField(
        max_length=20,
        choices=ComponentType.choices
    )
    name = models.CharField(max_length=255)
    manufacturer = models.CharField(max_length=255)
    part_number = models.CharField(max_length=100, unique=True)
    
    # Pricing & Availability
    price = models.CharField(max_length=50)  # e.g., "$25-35"
    availability = models.CharField(max_length=100, default='In Stock')
    lead_time = models.CharField(max_length=100, default='2-3 weeks')
    
    # Rating
    rating = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        default=4.5
    )
    
    # Specifications (JSON for flexibility)
    specifications = models.JSONField(default=list)  # List of spec strings
    pros = models.JSONField(default=list)  # List of pros
    cons = models.JSONField(default=list)  # List of cons
    alternatives = models.JSONField(default=list)  # List of alternatives
    
    # Vendor URL
    vendor_url = models.URLField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-rating']
        indexes = [
            models.Index(fields=['component_type', 'rating']),
            models.Index(fields=['manufacturer']),
        ]
    
    def __str__(self):
        return f"{self.name} - {self.manufacturer}"


class ComponentSpecification(models.Model):
    """
    Dynamic specifications per component type
    Bearing: bore_diameter, outer_diameter, dynamic_load_rating, speed_rating, l10_life
    Motor: power, speed, voltage, efficiency, insulation_class
    Gear: module, material, power_transmission, precision_grade
    Seal: diameter, pressure_rating, temperature_range, elastomer_type
    Fastener: diameter, clamp_load, material_grade, tensile_strength
    """
    component = models.OneToOneField(Component, on_delete=models.CASCADE, related_name='specification')
    
    # Bearing specs
    bore_diameter = models.FloatField(null=True, blank=True)  # mm
    outer_diameter = models.FloatField(null=True, blank=True)  # mm
    width = models.FloatField(null=True, blank=True)  # mm
    dynamic_load_rating = models.FloatField(null=True, blank=True)  # kN
    static_load_rating = models.FloatField(null=True, blank=True)  # kN
    speed_rating = models.FloatField(null=True, blank=True)  # RPM
    l10_life = models.FloatField(null=True, blank=True)  # hours
    
    # Motor specs
    power = models.FloatField(null=True, blank=True)  # kW
    speed = models.FloatField(null=True, blank=True)  # RPM
    voltage = models.CharField(max_length=50, null=True, blank=True)
    efficiency = models.FloatField(null=True, blank=True)  # %
    insulation_class = models.CharField(max_length=10, null=True, blank=True)
    frame_size = models.CharField(max_length=20, null=True, blank=True)
    
    # Gear specs
    module = models.FloatField(null=True, blank=True)  # mm
    gear_material = models.CharField(max_length=100, null=True, blank=True)
    pressure_angle = models.FloatField(null=True, blank=True)  # degrees
    face_width = models.FloatField(null=True, blank=True)  # mm
    power_transmission = models.FloatField(null=True, blank=True)  # kW
    precision_grade = models.CharField(max_length=20, null=True, blank=True)
    
    # Seal specs
    seal_diameter = models.FloatField(null=True, blank=True)  # mm
    pressure_rating = models.FloatField(null=True, blank=True)  # bar
    temp_min = models.FloatField(null=True, blank=True)  # °C
    temp_max = models.FloatField(null=True, blank=True)  # °C
    elastomer_type = models.CharField(max_length=50, null=True, blank=True)
    
    # Fastener specs
    fastener_diameter = models.CharField(max_length=20, null=True, blank=True)  # M8, M10, etc
    clamp_load_capacity = models.FloatField(null=True, blank=True)  # N
    material_grade = models.CharField(max_length=50, null=True, blank=True)  # 8.8, 10.9, etc
    tensile_strength = models.FloatField(null=True, blank=True)  # MPa
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Specs for {self.component.name}"


class SelectionHistory(models.Model):
    """Track user selections for analytics"""
    component_type = models.CharField(max_length=20, choices=ComponentType.choices)
    form_data = models.JSONField()
    selected_component = models.ForeignKey(Component, on_delete=models.SET_NULL, null=True)
    match_score = models.IntegerField()
    criteria_matches = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.component_type} selection on {self.created_at}"


class Cart(models.Model):
    """Shopping cart for components"""
    session_id = models.CharField(max_length=100, unique=True)
    components = models.JSONField(default=list)  # List of {component_id, quantity, price}
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Cart {self.session_id}"
    
    def get_total_price(self):
        total = 0
        for item in self.components:
            price = float(item.get('price', '0').replace('$', '').split('-')[0])
            total += price * item.get('quantity', 1)
        return total
