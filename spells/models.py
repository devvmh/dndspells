from __future__ import unicode_literals

from django.db.models import *

class CasterClass(Model):
  ARTIFICER = 'Artificer'
  BARD = 'Bard'
  CLERIC = 'Cleric'
  DRUID = 'Druid'
  PALADIN = 'Paladin'
  RANGER = 'Ranger'
  SORCERER = 'Sorcerer'
  WARLOCK = 'Warlock'
  WIZARD = 'Wizard'
  CLASSES = (
    (ARTIFICER, 'Artificer'),
    (BARD, 'Bard'),
    (CLERIC, 'Cleric'),
    (DRUID, 'Druid'),
    (PALADIN, 'Paladin'),
    (RANGER, 'Ranger'),
    (SORCERER, 'Sorcerer'),
    (WARLOCK, 'Warlock'),
    (WIZARD, 'Wizard')
  )
  name = CharField(max_length=255, primary_key=True, choices=CLASSES)
  def __str__(self): return self.name

class Spell(Model):
  SCHOOLS = [(x,x) for x in ['Abjuration', 'Conjuration', 'Divination',
                             'Enchantment', 'Evocation', 'Illusion',
                             'Necromancy', 'Transmutation']]
  LEVELS = [(x,x) for x in ['cantrip', '1st', '2nd', '3rd', '4th', '5th',
                            '6th', '7th', '8th', '9th']]
  name = CharField(max_length=255)
  level = CharField(max_length=255, choices=LEVELS)
  school = CharField(max_length=255, choices=SCHOOLS)
  ritual = BooleanField(default=False)
  concentration = BooleanField(default=False)
  classes = ManyToManyField('CasterClass', blank=True)
  casting_time = CharField(max_length=255)
  range = CharField(max_length=255)
  components = CharField(max_length=2048)
  duration = CharField(max_length=255)
  description = TextField()

  def __str__(self): return self.name
