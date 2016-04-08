#!/bin/bash

DEPLOY_DIR=/home/dnd/dndspells
DEPLOY_USER=dnd
WEB_USER=www-data

set -e

#default is locked down from web access
chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${DEPLOY_DIR}
find ${DEPLOY_DIR} -type d -exec chmod u=rwx,g=rx,o= '{}' \;
find ${DEPLOY_DIR} -type f -exec chmod u=rw,g=r,o= '{}' \;

#allow web server to access web directory
chgrp -R ${WEB_USER} ${DEPLOY_DIR}/dndspells

#venv setup
chgrp -R ${WEB_USER} ${DEPLOY_DIR}/venv/bin
chmod -R g-w ${DEPLOY_DIR}/venv/bin

#allow editing sqlite file
chmod g+w ${DEPLOY_DIR}/db.sqlite3

#executables
chmod -R ug+x ${DEPLOY_DIR}/venv/bin
chmod -R u+x ${DEPLOY_DIR}/bin
chmod -R u+x ${DEPLOY_DIR}/js/node_modules/.bin
