#!/bin/bash
my_dir=`dirname $0`
source $my_dir/variables.txt
rm -rf /var/www/html/*
cp -R /home/$username/squire/web/backup/* /var/www/html/
