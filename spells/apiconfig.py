from rest_framework.serializers import *
from rest_framework.viewsets import *
from .models import *

class SpellSerializer(ModelSerializer):
  class Meta:
    model = Spell
    fields = ('id', 'name', 'level', 'school', 'ritual', 'concentration',
              'classes', 'casting_time', 'range', 'components', 'duration',
              'description')

class SpellViewSet(ModelViewSet):
  queryset = Spell.objects.all()
  serializer_class = SpellSerializer
  filter_fields = ('id', 'name', 'level', 'school', 'ritual',
                   'concentration', 'classes', 'casting_time', 'range',
                   'components', 'duration', 'description')
