#!/bin/bash
source variables.txt

ssh -i $key -t $username@$backend_ip "sudo /home/$username/squire/scripts/deploy_backend.sh"
ssh -i $key -t $username@$db_ip "sudo /home/$username/squire/scripts/deploy_db.sh"
ssh -i $key -t $username@$web_ip "sudo /home/$username/squire/scripts/deploy_web.sh"