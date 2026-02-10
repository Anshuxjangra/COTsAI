"""
URL configuration for cots_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ComponentViewSet, select_parts, download_specs, download_bom

router = DefaultRouter()
router.register(r'components', ComponentViewSet, basename='component')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/select-parts/', select_parts, name='select_parts'),
    path('api/download-specs/', download_specs, name='download_specs'),
    path('api/download-bom/', download_bom, name='download_bom'),
    path('api-auth/', include('rest_framework.urls')),
]
