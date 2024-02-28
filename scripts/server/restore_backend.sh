#!/bin/bash
my_dir=`dirname $0`
source $my_dir/variables.txt
wget http://admin-script:$tomcat_user_password@$ip:8080/manager/text/undeploy?path=/api
touch /home/$username/squire/backend/backup/api.war
wget http://admin-script:$tomcat_user_password@$ip:8080/manager/text/deploy?war=file:/home/$username/squire/backend/backup/api.war
