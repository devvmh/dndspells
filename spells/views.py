from django.shortcuts import render
from django.http import HttpResponse
import json

from .models import *

def index(request):
  return render(request, 'index.html', {
    'classes': json.dumps([x for x in CasterClass.objects.values()])
  })

# private methods

def get_classes(spell):
  return list(map(lambda x: x['name'], Spell.objects.get(id=spell['id']).classes.values()))

def with_classes(spell):
  spell['classes'] = get_classes(spell)
  return spell

def spells():
  spells = map(with_classes, Spell.objects.order_by('name').values())
  return spells
