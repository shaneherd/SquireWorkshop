#!/bin/bash
source variables.txt

ssh -i $key -t $username@$db_ip "sudo /home/$username/squire/scripts/backup_db.sh"
