from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import index
from .apiconfig import SpellViewSet

router = DefaultRouter()
router.register(r'spells', SpellViewSet)

urlpatterns = [
  path('', index, name='index'),
  path('api/', include(router.urls))
]
