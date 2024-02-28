package com.herd.squire.services;

import java.text.MessageFormat;
import java.util.Locale;
import java.util.ResourceBundle;

public class TranslateService {
    public static String translate(String key) {
        return translate("en", "US", key);
    }

    public static String translate(String key, Object... params) {
        return translate("en", "US", key, params);
    }

    public static String translate(String language, String country, String key, Object... params) {
        Locale locale = new Locale(language, country);
        ResourceBundle messages = ResourceBundle.getBundle("MessagesBundle", locale);
        if (params == null) {
            return messages.getString(key);
        } else {
            return MessageFormat.format(messages.getString(key), params);
        }
    }
}
