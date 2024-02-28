#!/bin/bash
source variables.txt

cd $repo_directory/backend
mvn clean -P $backend_env
mvn package -P $backend_env -DskipTests

scp -i $key $repo_directory/backend/target/api.war $username@$backend_ip:/home/$username/squire/backend/new
ssh -i $key -t $username@$backend_ip "sudo /home/$username/squire/scripts/deploy_backend.sh"
