FROM maven:3.9.6 as maven

WORKDIR /usr/src/app
COPY . /usr/src/app

# Create empty config file that will be replaced by using envvars
RUN touch ./src/main/resources/config.properties


# Create package without running tests, since they will fail
RUN mvn package -P prod -Dmaven.test.skip -Dmaven.artifact.threads=30

FROM tomcat:9.0.86

#Data & Config - Persistent Mount Point
ENV APP_DATA_FOLDER=/var/lib/app

WORKDIR /usr/local/tomcat/webapps/
# Remove any preinstalled apps
RUN rm -rf ./*
# Move over the war file from previous build step
COPY --from=maven /usr/src/app/target/api.war ./api.war

WORKDIR $APP_DATA_FOLDER

EXPOSE 8080
ENTRYPOINT ["catalina.sh", "run"]