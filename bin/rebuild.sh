#!/bin/bash

cd $(basename $0)
source venv/bin/activate

python manage.py migrate

cd js
npm run build
cd ..

python manage.py collectstatic

passenger-config restart-app .
