from django.shortcuts import render
from django.http import HttpResponse
import json

from .models import *

def index(request):
  return render(request, 'index.html', {
    'spells': json.dumps([x for x in Spell.objects.values()])
  })

# private methods

def spells():
  spells = {}
  for spell in Spell.objects.values():
    spells[spell['id']] = spell
  return spells
  
