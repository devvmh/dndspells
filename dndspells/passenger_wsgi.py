# Set up the virtual environment:
import os, sys
try:
  from localconfig import PASSENGER_PATH
  from localconfig import PASSENGER_VIRTUAL_ENV
  from localconfig import PASSENGER_CHDIR
except:
  PASSENGER_PATH = '/home/dndspells/dndspells/venv/bin:/usr/local/bin:/usr/bin'
  PASSENGER_VIRTUAL_ENV = '/home/dndspells/dndspells/venv/bin'
  PASSENGER_CHDIR = '/home/dndspells/dndspells'

os.environ['PATH'] = PASSENGER_PATH
os.environ['VIRTUAL_ENV'] = PASSENGER_VIRTUAL_ENV
os.environ['PYTHON_EGG_CACHE'] = PASSENGER_VIRTUAL_ENV
os.chdir(PASSENGER_CHDIR)
sys.path.insert(0, PASSENGER_CHDIR)

os.environ['DJANGO_SETTINGS_MODULE'] = 'dndspells.settings'

# only for Django >= 1.7
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
