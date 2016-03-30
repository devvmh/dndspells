from django.core.serializers import serialize
from django.shortcuts import render

from .models import *

def index(request):
  spells_json = serialize("json", Spell.objects.all())
  return render(request, 'index.html', {
    'spells_json': spells_json
  })
