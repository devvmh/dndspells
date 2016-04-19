#!/bin/bash

cd $(dirname $0)/..
source venv/bin/activate

if [[ "$1" == "-p" ]]; then
  git pull
fi

python manage.py migrate

(cd js && npm run build)

python manage.py collectstatic --noinput
bin/fix-permissions.sh

passenger-config restart-app .
