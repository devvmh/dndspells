Django/React project to host DND 5e spell data

To run it (need python's virtualenv):

    virtualenv venv
    source venv/bin/activate
    pip install -r requirements.txt

Now create dndspells/localconfig.py and define these three variables (shown with their default values in passenger_wsgi.py):

  PASSENGER_PATH = '/home/dndspells/dndspells/venv/bin:/usr/local/bin:/usr/bin'
  PASSENGER_VIRTUAL_ENV = '/home/dndspells/dndspells/venv/bin'
  PASSENGER_CHDIR = '/home/dndspells/dndspells'

Now install Phusion Passenger + nginx and serve that file. My nginx config looks like:

    server {
      listen 80;
      server_name dndspells.devinhoward.ca;
      root /home/dndspells/dndspells;

      access_log /home/dndspells/logs/access.log;
      error_log /home/dndspells/logs/error.log error;
      error_log /var/log/nginx/error.log;

      location /static {
        expires max;
        break;
      }

      location / {
        passenger_enabled on;
        passenger_app_type wsgi;
        passenger_python /home/dndspells/dndspells/venv/bin/python;
        passenger_app_root /home/dndspells/dndspells/dndspells;
        passenger_friendly_error_pages on;
      }
    }

You also probably need to run `python manage.py collectstatic`. You can just run `bin/rebuild.sh` if you aren't sure.
