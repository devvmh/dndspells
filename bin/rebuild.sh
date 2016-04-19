#!/bin/bash

cd $(dirname $0)/..
source venv/bin/activate

git pull

python manage.py migrate

(cd js && npm run build)

python manage.py collectstatic --noinput

echo "Fixing perms..."
bin/fix-permissions.sh

passenger-config restart-app .
