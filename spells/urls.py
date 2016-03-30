from django.conf.urls import patterns, include, url

from .views import *

urlpatterns = patterns('spells.views',
  url(r'^$', 'index', name='index'),
  url(r'spells.json$', 'spells_json', name='spells_json'),
)
