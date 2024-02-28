#!/bin/bash
my_dir=`dirname $0`
source $my_dir/variables.txt
mysql -u root -p 'squire' < /home/$username/squire/database/backups/squire_backup.sql

