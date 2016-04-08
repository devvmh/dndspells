#!/bin/bash

cd $(dirname $0)/..
source venv/bin/activate

python manage.py migrate

cd js
npm run build
cd ..

python manage.py collectstatic --noinput
bin/fix-permissions.sh

passenger-config restart-app .
