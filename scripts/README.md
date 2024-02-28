# Squire Workshop Scripts

## How to use the scripts
This directory has some scripts that you can use to help you deploy any updates to your dedicated server. Please run through the `Setting up a dedicated server` before using these scripts.

There are 2 directories containing scripts: `local` and `server`. The `local` directory scripts are to be ran on the machine that you are building the code and the `server` directory scripts are to be ran on the machine that you are running the server on. These can be the same machine.

In both the `\local` and `\server` directories, create a copy of `variables.example.txt` and name it `variables.txt`. Update the variables with the appropriate values. Make sure to not commit these files to the repository.

### Variable explanations
* local
  * backend_ip - This is the address of your tomcat server.
  * db_ip - This is the address of your database server.
  * web_ip - This is the address of your web server.
  * username - This is the username on the machine that the server will be running. This is the directory that the server scripts will reside (this is assuming that you follow the recommended folder structure defined below)
  * key - This is the location of your ssh key that will be used to run the scripts on the server that is generated in the `Create your ssh key` steps below.
  * backend_env - This is the environment that you want to build your project with. This will correlate with the environment that you defined in the backend config file.
  * web_env - This is the environment that you want to build your project with. This will correlate with the environment that you defined in the frontend config file.
* server
  * ip - This is the address that the current server is running on. 
  * tomcat_user_password - This is the tomcat user password that the scripts will be ran with to deploy the war file. This is set in the `/opt/tomcat/conf/tomcat-users.xml` file during the `Install Tomcat (Backend Service)` steps below for the `admin-script` line.
  * username - This is the username on the machine that the server will be running. This is the directory that the server script will reside (this is assuming that you follow the recommended folder structure defined below)

### Script explanations
* local
  * deploy_backend.sh - This will build and deploy the backend code to the server.
  * deploy_db.sh - This will copy any new scripts from the database directory to the server. The scripts will then be ran on the server to update the database. You will need to enter your db password for each script.
  * deploy_web.sh - This will build and deploy the frontend code to the server.
  * prep_deploy.sh - This will build everything (frontend and backend) and move the files to the server. It doesn't actually deploy the code to the server. That is done in the `finalize_deplopy.sh` script. This is intended to minimize downtime where the frontend and backend are out of sync due to the time it takes to copy all of the files to the server.
  * finalize_deploy.sh - This will take all the files that have already been copied to the server and deploy them.
  * squire_deploy.sh - This script will build and deploy everything (web, backend, and db). If you aren't worried about server downtime, you can run this and it will do everything in one command. This script can take awhile. Don't forget that you will be required to enter your database password for each new script that needs to be ran. 
  * restore_backend.sh - This will revert the latest changes to the backend to the previous state. You can only go back by one deploy.
  * restore_db.sh - This will revert the latest changes to the database to the last backup. You will be prompted for your db password.
  * restore_web.sh - This will revert the latest changes to the frontend to the previous state. You can only go back by one deploy.
  * squire_restore.sh - This will run all the restore scripts from above.
  * backup_db.sh - This will create a backup of the current database. You will be prompted for your db password.
* server
  * deploy_backend.sh - This will make a backup of the previous war file. It will undeploy the only file and deploy the new one. 
  * deploy_db.sh - This will make a backup of the database and then deploy all the new scripts. You will be prompted for your password for each script.
  * deploy_web.sh - This will create a backup of the current frontend files and then deploy the new files.
  * restore_backend.sh - This will revert the latest changes to the backend to the previous state. You can only go back by one deploy.
  * restore_db.sh - This will revert the latest changes to the database to the last backup. You will be prompted for your db password.
  * restore_web.sh - This will revert the latest changes to the frontend to the previous state. You can only go back by one deploy.
  * backup_db.sh - This will create a backup of the current database. You will be prompted for your db password.

## Setting up a dedicated server
The following steps are for setting up a dedicated server on a Linux machine. These steps will vary if you are using a different OS.

Anytime you see something like `<variable_name>`, please replace everything including the `<` and `>` with the appropriate value.

### Create your ssh key
* Run the following
```
cd ~/.ssh
eval $(ssh-agent)
ssh-keygen -t rsa -b 2048
```
* enter name of `squire_server`
* Run the following
```
ssh-add ~/.ssh/squire_server
ssh-copy-id -i ~/.ssh/squire_server.pub <server_username>@<server_ip>
```
* Type `yes` if asked to add to known fingerprints
* Enter your password to login to the server
* Repeat the last command for each server you're hosting

### Create folders
* On your dedicated server, create the following folders under your `/home/<username>` directory
  * /squire/backend/backup
  * /squire/backend/new
  * /squire/database/backups
  * /squire/database/scripts/deployed
  * /squire/database/scripts/new
  * /squire/images
    * This can be any location, but this needs to match the value that you have in your `config.stage.properties` file for `imagesPath` in your backend.
  * /squire/scripts
    * Copy the `/squire-workshop/scripts/server` scripts to this directory
    * Make sure to copy the `variables.txt` file after you've populated the values.
    * Run the following on each script file
    ```
    chmod +x <filename>
    ```
    * Note: If you want the scripts to live somewhere else, make sure to update the path in the /squire-workshop/scripts/local files to point to the correct location.
  * /squire/web/backup
  * /squire/web/dist

### Preparation Steps
* Open a terminal on the dedicated server
* Run the following
```
sudo apt-get update
sudo apt install maven
sudo apt install vim
sudo apt install curl
sudo apt install htop
```
* Note: If you are running the database on a separate server from the rest of the code, then you don't need to install maven on the database server.

### Install MySql
* Note: If you are doing this on the same server that you did the development setup, you don't need to perform this step.
* For more details on the steps below, refer to this article: https://phoenixnap.com/kb/how-to-install-mysql-on-ubuntu-18-04
* Run the following
```
wget -c https://dev.mysql.com/get/mysql-apt-config_0.8.11-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.11-1_all.deb
sudo apt-get update
sudo apt-get install mysql-server
    enter password
    re-enter password
    strong password encryption
sudo service mysql status
```

### Install the Database
* Note: If you are doing this on the same server that you did the development setup, you don't need to perform this step.
* Connect to the database
```
mysql -u root -p
    enter password
```
* In the MySql terminal, run the following
```
CREATE DATABASE squire;
CREATE USER '<database_username>'@'<backend_server_ip>' IDENTIFIED BY '<password>';
GRANT ALL PRIVILEGES ON squire . * TO '<database_username>'@'<backend_server_ip>';
FLUSH PRIVILEGES;
quit
```
* Note: the recommended `database_username` is `squire` but you can set this to whatever you want. Just make sure to have the `jdbcUser` and `jdbcPassword` values in the backend config file match what you put in this step.
* Copy the `initial_db.sql` script from the `\squire-workshop\database` directory to the server.
* Run the following
```
sudo mysql -u root -p squire < initial_db.sql
```
* You can verify that the database was installed correctly by connecting to the MySql terminal and running the following:
```
mysql -u root -p
use squire;
show tables;
```

### Allow Remote Access to the Database
* Note: You only need to do this step if you are running the database on a separate server from the rest of the code.
* For more details on the steps below, refer to this article: https://www.digitalocean.com/community/tutorials/how-to-allow-remote-access-to-mysql
* Run the following
```
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
```
* Add the following line to the file
```
bind-address = 0.0.0.0
```
* Run the following
```
sudo systemctl restart mysql
sudo ufw allow from <backend_server_ip> to any port 3306
```
* You can test logging into the database server from the backend server by running the following:
```
mysql -u <database_username> -h <database_server_ip> -p
```

### Install Apache2 (Frontend Service)
* For mre details on the steps below, refer to this article: https://ubuntu.com/tutorials/install-and-configure-apache#1-overview
* Run the following
```
sudo apt update
sudo apt install apache2
```

### Install Tomcat (Backend Service)
* For more details on the steps below, refer to this article: https://phoenixnap.com/kb/how-to-install-tomcat-ubuntu
* Run the following
```
sudo apt install default-jdk
java –version
sudo groupadd tomcat
sudo useradd -s /bin/false -g tomcat -d /opt/tomcat tomcat
cd /tmp
curl -O https://apache.osuosl.org/tomcat/tomcat-9/v9.0.43/bin/apache-tomcat-9.0.43.tar.gz
```
* Note: this last step sometimes has issues, so you might need to download the tar.gz and scp the file.
  * https://tomcat.apache.org/download-90.cgi
* Run the following
```
sudo mkdir /opt/tomcat
sudo tar xzvf apache-tomcat-9*tar.gz -C /opt/tomcat --strip-components=1
cd /opt/tomcat
sudo chgrp -R tomcat /opt/tomcat
sudo chmod -R g+r conf
sudo chmod g+x conf
sudo chown -R tomcat webapps/ work/ temp/ logs/
sudo update-java-alternatives -l
```
* Get the location for JAVA_HOME from the output
* Run the following
```
sudo vim /etc/systemd/system/tomcat.service
```
* Populate it with the following:
```
[Unit]
Description=Apache Tomcat Web Application Container
After=network.target

[Service]
Type=forking

Environment=JAVA_HOME=<java_home value from previous output>
Environment=CATALINA_PID=/opt/tomcat/temp/tomcat.pid
Environment=CATALINA_HOME=/opt/tomcat
Environment=CATALINA_BASE=/opt/tomcat
Environment='CATALINA_OPTS=-Xms512M -Xmx1024M -server -XX:+UseParallelGC'
Environment='JAVA_OPTS=-Djava.awt.headless=true -Djava.security.egd=file:/dev/./urandom'

ExecStart=/opt/tomcat/bin/startup.sh
ExecStop=/opt/tomcat/bin/shutdown.sh

User=tomcat
Group=tomcat
UMask=0007
RestartSec=10
Restart=always

[Install]
WantedBy=multi-user.target
```
* Run the following
```
sudo systemctl daemon-reload
sudo systemctl start tomcat
sudo systemctl status tomcat
sudo ufw allow 8080/tcp
sudo ufw allow 8443/tcp
su - root
sudo vim /opt/tomcat/conf/tomcat-users.xml
```
* Add the following to the <tomcat-users> block
```
<role rolename="admin-gui"/>
<role rolename="manager-gui"/>
<role rolename="manager-script"/>
<user username="admin" password="<password>" roles="admin-gui, manager-gui"/>
<user username="admin-script" password="<password>" roles="admin-gui, manager-script"/>
```
* Run the following
```
sudo vim /opt/tomcat/webapps/manager/META-INF/context.xml
```
* Comment out the <Value> tag in the <Context> block
* Run the following
```
sudo vim /opt/tomcat/webapps/host-manager/META-INF/context.xml
```
* Comment out the <Value> tag in the <Context> block

### Allow CORS
* Run the following
```
sudo vim /opt/tomcat/conf/web.xml
```
* Add the following to the file along with the other filters in the file
```
<filter>
  <filter-name>CorsFilter</filter-name>
  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
  <init-param>
    <param-name>cors.allowed.origins</param-name>
    <param-value>*</param-value>
  </init-param>
  <init-param>
    <param-name>cors.allowed.methods</param-name>
    <param-value>GET,POST,HEAD,OPTIONS,PUT,DELETE</param-value>
  </init-param>
  <init-param>
    <param-name>cors.exposed.headers</param-name>
    <param-value>Access-Control-Allow-Origin</param-value>
  </init-param>
  <init-param>
    <param-name>cors.allowed.headers</param-name>
    <param-value>origin,content-type,accept,Access-Control-Request-Method,Access-Control-Request-Headers,authorization</param-value>
  </init-param>
</filter>
<filter-mapping>
  <filter-name>CorsFilter</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```
* Run the following
```
systemctl restart tomcat
```
