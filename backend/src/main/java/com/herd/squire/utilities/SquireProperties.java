package com.herd.squire.utilities;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.logging.Logger;
import java.lang.System;

public class SquireProperties {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());
    private static Properties properties = null;
    private static boolean testing = false;
    private static final Boolean shouldLoadPropertiesFromEnvironment = System.getenv("SQUIRE_ENV") != null;

    private SquireProperties() {
    }

    public static void setTesting(boolean isTesting) {
        testing = isTesting;
    }

    public static String getProperty(String key) {
        if (testing && key.equals("dbUrl")) {
            key = "dbUrlTest";
        }
        try {
            if (properties == null) {
                loadProperties();
            }
            return properties.getProperty(key);
        } catch (IOException e) {
            logger.warning(e.getMessage());
        }
        return null;
    }

    private static Boolean containsExampleValue(String envKey) {
        String envValue = System.getenv(envKey);
        return envValue != null && envValue.equals("YOUR_SECRET_HERE");
    }

    private static void loadPropertyFromEnvironment(String propertyKey, String envKey) {
        properties.setProperty(propertyKey, System.getenv(envKey));
    }

    private static void loadProperties() throws IOException {
        properties = new Properties();

        if (shouldLoadPropertiesFromEnvironment) {
            logger.info("Detected SQUIRE_ENV, loading properties from environment variables.");

            // Make sure that users changed the environment variables that declare secrets.
            if (containsExampleValue("MYSQL_PASSWORD")
                    || containsExampleValue("SQUIRE_JWT_SECRET")
                    || containsExampleValue("SQUIRE_ID_SECRET")) {
                String errorMessage = "A config environment variable is set to the default example value. Please set the environment variable to a new random value. If you don't know how to do this, please read the [Docker Compose Setup]>[Configuration] section in the readme.";
                logger.severe(errorMessage);
                throw new RuntimeException(errorMessage);
            }

            loadPropertyFromEnvironment("env", "SQUIRE_ENV");
            loadPropertyFromEnvironment("jdbcUser", "SQUIRE_JDBC_USER");
            loadPropertyFromEnvironment("jdbcPassword", "MYSQL_PASSWORD");
            loadPropertyFromEnvironment("dbUrl", "SQUIRE_DB_URL");
            loadPropertyFromEnvironment("logPath", "SQUIRE_LOG_PATH");
            loadPropertyFromEnvironment("imagesPath", "SQUIRE_IMAGES_PATH");
            loadPropertyFromEnvironment("useSsl", "SQUIRE_USE_SSL");
            loadPropertyFromEnvironment("jwtSecret", "SQUIRE_JWT_SECRET");
            loadPropertyFromEnvironment("idSecret", "SQUIRE_ID_SECRET");
            loadPropertyFromEnvironment("allowSignup", "SQUIRE_ALLOW_SIGNUP");
            loadPropertyFromEnvironment("baseUrl", "SQUIRE_BASE_URL");
            loadPropertyFromEnvironment("emailAddress", "SQUIRE_EMAIL_ADDRESS");
            loadPropertyFromEnvironment("emailPassword", "SQUIRE_EMAIL_PASSWORD");
            loadPropertyFromEnvironment("notifyEmailAddress", "SQUIRE_NOTIFY_EMAIL_ADDRESS");
        } else {
            logger.info("SQUIRE_ENV not set, using properties from config.properties file.");

            InputStream input = SquireProperties.class.getClassLoader().getResourceAsStream("config.properties");
            properties.load(input);
        }
    }
}
