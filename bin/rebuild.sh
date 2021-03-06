#!/bin/bash

cd $(dirname $0)/..
source venv/bin/activate

git pull

pip install -r requirements.txt
python manage.py migrate

(cd js && npm install && npm run build)

python manage.py collectstatic --noinput

echo "Fixing perms..."
bin/fix-permissions.sh

passenger-config restart-app .
