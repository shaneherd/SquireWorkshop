#!/bin/bash
source variables.txt

cd $repo_directory/backend
mvn clean -P $backend_env
mvn package -P $backend_env -DskipTests

cd $repo_directory/frontend
export NODE_OPTIONS=--openssl-legacy-provider
ng build --configuration $web_env

scp -i $key $repo_directory/backend/target/api.war $username@$backend_ip:/home/$username/squire/backend/new
scp -i $key $repo_directory/database/Scripts/new/* $username@$db_ip:/home/$username/squire/database/scripts/new
scp -i $key -r $repo_directory/frontend/dist/* $username@$web_ip:/home/$username/squire/web/dist

mv $repo_directory/database/Scripts/new/* $repo_directory/database/Scripts/deployed/
