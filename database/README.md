# Squire Workshop Database
The following steps are for DataGrip. These steps will vary if you are using a different IDE.

## Installation
* Download and install MySQL from https://dev.mysql.com/downloads/mysql/
* Set the password for admin
* Add another user that you will login with in DataGrip. Note the password.
* In DataGrip, create a new datasource connecting to localhost. Use the username and password from the previous step.
* Right-click on the datasource and create a new schema called "Squire".
* In the console, run the following replacing the password with your desired value. Keep note of the password. You'll need this value in a config file for the backend code.
```
CREATE USER 'squire'@'%' IDENTIFIED BY 'my_password';
GRANT ALL PRIVILEGES ON squire . * TO 'squire'@'%';
```
* Create another datasource that connects to the squire database logged in as the squire user. Make sure to select the `squire` schema in the schema tab.
* Right-click on the schema and click on Import/Export -> Restore.
    * It is really important that you do this logged in as the `squire` user and not your admin user. If you do this as the admin user, then the stored procedures won't be able to be ran by the squire user. If you want to do everything as your admin user, you can do this by specifying your admin username in the config file in the backend, but it is best practice to use a specific user from the app so that scripts can't access other databases.
* Set the mysql path to something like this: C:/Program Files/MySQL/MySQL Server 8.2/bin/mysql.exe
* Set the path to the dump to something like this: C:\Git\squire-workshop\database\initial_db.sql
* Click Run. To ensure that things worked properly, run the following in the console window. If 6 rows are returned, then the script restored the database correctly.
```
select * from abilities
```
