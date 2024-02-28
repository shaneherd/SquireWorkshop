#!/bin/bash
my_dir=`dirname $0`
source $my_dir/variables.txt
var=$(date +"%FORMAT_STRING")
now=$(date +"%Y_%m_%d_%H_%M_%S")
filename="squire_backup_$now.sql"

mysqldump -u root -p 'squire' --routines > /home/$username/squire/database/backups/squire_backup.sql
cp /home/$username/squire/database/backups/squire_backup.sql /home/$username/squire/database/backups/$filename
