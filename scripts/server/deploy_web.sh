#!/bin/bash
my_dir=`dirname $0`
source $my_dir/variables.txt
rm -rf /home/$username/squire/web/backup/*
mv /var/www/html/* /home/$username/squire/web/backup/
cp -R /home/$username/squire/web/dist/* /var/www/html/
