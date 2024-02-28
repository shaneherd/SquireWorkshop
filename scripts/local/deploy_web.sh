#!/bin/bash
source variables.txt

cd $repo_directory/frontend
export NODE_OPTIONS=--openssl-legacy-provider
ng build --configuration $web_env

scp -i $key -r $repo_directory/frontend/dist/* $username@$web_ip:/home/$username/squire/web/dist
ssh -i $key -t $username@$web_ip "sudo /home/$username/squire/scripts/deploy_web.sh"
