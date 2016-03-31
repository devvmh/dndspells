from django.conf.urls import patterns, include, url
from rest_framework.routers import DefaultRouter

from .views import *
from .apiconfig import SpellViewSet

router = DefaultRouter()
router.register(r'spells', SpellViewSet)

urlpatterns = patterns('spells.views',
  url(r'^$', 'index', name='index'),
  url(r'^api/', include(router.urls))
)
