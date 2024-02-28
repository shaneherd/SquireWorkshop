package com.herd.squire.utilities;

import java.util.logging.FileHandler;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

public class SquireLogger {
    private static final Logger logger = Logger.getLogger(SquireLogger.class.getName());

    static public void setup() {
        try {
            String logPath = SquireProperties.getProperty("logPath");
            SimpleFormatter formatter = new SimpleFormatter();
            boolean append = true;
            int limit = 1024 * 1024; //1 MB
            int numLogFiles = 50;

            FileHandler handler = new FileHandler(logPath, limit, numLogFiles, append);
            handler.setFormatter(formatter);
            logger.addHandler(handler);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
