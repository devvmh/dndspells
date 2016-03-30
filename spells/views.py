from django.shortcuts import render
from django.http import HttpResponse
import json

from .models import *

def index(request):
  return render(request, 'index.html', {
    'spells': json.dumps(spells())
  })

def spells_json(request):
  return HttpResponse(json.dumps(spells()), content_type='application/json')

# private methods

def spells():
  spells = {}
  for spell in Spell.objects.values():
    spells[spell['id']] = spell
  return spells
  
