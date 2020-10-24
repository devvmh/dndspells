"""
  dndspells URL Configuration
"""
from django.urls import include, path
from django.contrib import admin

admin.autodiscover()

urlpatterns = [
  path('admin/', admin.site.urls),
  path('api-auth/', include('rest_framework.urls')),
  path('', include('spells.urls')),
]
