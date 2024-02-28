#!/bin/bash
source variables.txt

scp -i $key $repo_directory/database/Scripts/new/* $username@$db_ip:/home/$username/squire/database/scripts/new
mv $repo_directory/database/Scripts/new/* $repo_directory/database/Scripts/deployed/
ssh -i $key -t $username@$db_ip "sudo /home/$username/squire/scripts/deploy_db.sh"
