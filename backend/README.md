# Squire Workshop Backend
The following steps are for Intellij. These steps will vary if you are using a different IDE.

## Logging
* Create a folder anywhere that you want logs to be recorded. This will be referenced in a config file as `logPath`.

## Images
* Create a folder anywhere that you want images to be stored. This will be referenced in a config file as `imagesPath`.

## Configuration Files
* Copy the `config.example.properties` file and rename it as `config.dev.properties`.
    * `baseUrl` is the url that the fronted is hosted at.
    * `emailAddress` and `emailPassword` is for the email account that you will be sending emails FROM. Note: To be able to send emails, you have to enable additional settings in gmail.
    * `notifyEmailAddress` is for the email address that notifications will be sent to in case of errors.
    * `jdbcUser` and `jdbcPassword` are the values for the user that will make database requests. This is NOT an app user.
* If you want to have multiple environments, create another config file and replace `dev` in the filename with the appropriate environment. Update the values in the config file as needed.
* If you are using multiple environments, make sure to add the environment to `pom.xml` in the `<profiles>` section.

## Setup Java
* Download and install the Java SDK 13.0.2 from https://www.oracle.com/java/technologies/javase/jdk13-archive-downloads.html
* Open the project structure settings and point the project to the SDK from above.
* Open the advanced settings and add java to your environment variables
  * `JAVA_HOME`: `C:\Program Files\Java\jdk-13.0.2`
* Add java to your Path
  * `%JAVA_HOME%`

## Download Maven
* Download the latest version of Maven from https://maven.apache.org/download.cgi
* Unzip it and add it to your Program Files directory
* Open the advanced settings and add maven to your environment variables
  * `MAVEN_HOME`: `C:\Program Files\apache-maven-3.9.6`
* Add maven to your Path
  * `%MAVEN_HOME%\bin`

## Setup Tomcat
* Download the latest version of Tomcat from https://tomcat.apache.org/download-90.cgi
* Create a folder in C:\Program Files called "Tomcat".
* Move the extracted files from the download into that folder.
* Edit your run configurations. From the list, select Tomcat Server: Local.
* For the application server, click on Configure. Set the Target Home to be the folder that you added to your Tomcat directory. It should look something like 'C:\Program Files\Tomcat\apache-tomcat-9.0.6'. Click OK.
* Uncheck the box for "Open browser after launch" and set the URL to the following: http://localhost:8080/api/
* Set the JRE to the version of Java that you setup above.
* Set the HTTP Port to 8080
* In the deployment tab, click on the '+' icon and select artifact. Then select "api:war exploded".
* Set the Application context to "/api".

## Building the project
* From the maven tab, select the profile you want.
* Underneath api > Lifecycle click on "clean". Then click on "package". If the tests fail and you still want to build the project anyway, you can skip the tests by clicking on the "Skip Tests" button at the top of the maven tab.

## Running locally
Select your Tomcat run configuration and click on the Play or Debug icon.
