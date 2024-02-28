#!/bin/bash
source variables.txt

ssh -i $key -t $username@$ip "sudo /home/$username/squire/scripts/restore_web.sh"
