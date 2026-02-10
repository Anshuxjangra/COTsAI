from django.contrib import admin
from parts.models import Component, ComponentSpecification, SelectionHistory, Cart


class ComponentSpecificationInline(admin.TabularInline):
    model = ComponentSpecification
    extra = 0
    fields = (
        'bore_diameter', 'outer_diameter', 'dynamic_load_rating',
        'speed_rating', 'l10_life', 'power', 'speed', 'voltage',
        'module', 'seal_diameter', 'pressure_rating', 'fastener_diameter',
        'clamp_load_capacity'
    )


@admin.register(Component)
class ComponentAdmin(admin.ModelAdmin):
    list_display = ('name', 'manufacturer', 'component_type', 'part_number', 'price', 'rating', 'availability')
    list_filter = ('component_type', 'manufacturer', 'availability', 'rating')
    search_fields = ('name', 'manufacturer', 'part_number')
    inlines = [ComponentSpecificationInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('component_type', 'name', 'manufacturer', 'part_number')
        }),
        ('Pricing & Availability', {
            'fields': ('price', 'availability', 'lead_time')
        }),
        ('Rating & Reviews', {
            'fields': ('rating',)
        }),
        ('Details', {
            'fields': ('specifications', 'pros', 'cons', 'alternatives', 'vendor_url'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ComponentSpecification)
class ComponentSpecificationAdmin(admin.ModelAdmin):
    list_display = ('component', 'get_component_type')
    list_filter = ('component__component_type',)
    search_fields = ('component__name', 'component__manufacturer')
    
    def get_component_type(self, obj):
        return obj.component.component_type
    get_component_type.short_description = 'Component Type'
    
    fieldsets = (
        ('Component Reference', {
            'fields': ('component',)
        }),
        ('Bearing Specifications', {
            'fields': (
                'bore_diameter', 'outer_diameter', 'width',
                'dynamic_load_rating', 'static_load_rating', 'speed_rating', 'l10_life'
            ),
            'classes': ('collapse',)
        }),
        ('Motor Specifications', {
            'fields': ('power', 'speed', 'voltage', 'efficiency', 'insulation_class', 'frame_size'),
            'classes': ('collapse',)
        }),
        ('Gear Specifications', {
            'fields': (
                'module', 'gear_material', 'pressure_angle',
                'face_width', 'power_transmission', 'precision_grade'
            ),
            'classes': ('collapse',)
        }),
        ('Seal Specifications', {
            'fields': (
                'seal_diameter', 'pressure_rating', 'temp_min',
                'temp_max', 'elastomer_type'
            ),
            'classes': ('collapse',)
        }),
        ('Fastener Specifications', {
            'fields': (
                'fastener_diameter', 'clamp_load_capacity',
                'material_grade', 'tensile_strength'
            ),
            'classes': ('collapse',)
        }),
    )


@admin.register(SelectionHistory)
class SelectionHistoryAdmin(admin.ModelAdmin):
    list_display = ('component_type', 'selected_component', 'match_score', 'created_at')
    list_filter = ('component_type', 'match_score', 'created_at')
    search_fields = ('selected_component__name', 'selected_component__manufacturer')
    readonly_fields = ('form_data', 'criteria_matches', 'created_at')
    ordering = ['-created_at']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'component_count', 'updated_at')
    search_fields = ('session_id',)
    readonly_fields = ('components', 'created_at', 'updated_at')
    
    def component_count(self, obj):
        return len(obj.components)
    component_count.short_description = 'Items in Cart'
