#!/bin/bash

DEPLOY_DIR=/home/dndspells/dndspells
DEPLOY_USER=dndspells
WEB_USER=www-data

set -e

#default is locked down from web access
chown -R ${DEPLOY_USER}:${DEPLOY_USER} ${DEPLOY_DIR}
find ${DEPLOY_DIR} -path ${DEPLOY_DIR}/js/node_modules -prune -type d -exec chmod u=rwx,g=rx,o= '{}' \;
find ${DEPLOY_DIR} -path ${DEPLOY_DIR}/js/node_modules -prune -type f -exec chmod u=rw,g=r,o= '{}' \;

#allow web server to access web directory
chmod o+rx ${DEPLOY_DIR}
chgrp -R ${WEB_USER} ${DEPLOY_DIR}/dndspells
chgrp -R ${WEB_USER} ${DEPLOY_DIR}/static

#venv setup
chgrp -R ${WEB_USER} ${DEPLOY_DIR}/venv/bin
chmod -R g-w ${DEPLOY_DIR}/venv/bin

#allow editing sqlite file
chmod g+w ${DEPLOY_DIR}/db.sqlite3

#executables
chmod -R ug+x ${DEPLOY_DIR}/venv/bin
chmod -R u+x ${DEPLOY_DIR}/bin
