package com.herd.squire.models.user;

public class UserSettings {
    private boolean allowAdminAccess;
    private boolean subscribed;
    private String language;

    public UserSettings() {}

    public UserSettings(boolean allowAdminAccess, boolean subscribed, String language) {
        this.allowAdminAccess = allowAdminAccess;
        this.subscribed = subscribed;
        this.language = language;
    }

    public boolean isAllowAdminAccess() {
        return allowAdminAccess;
    }

    public void setAllowAdminAccess(boolean allowAdminAccess) {
        this.allowAdminAccess = allowAdminAccess;
    }

    public boolean isSubscribed() {
        return subscribed;
    }

    public void setSubscribed(boolean subscribed) {
        this.subscribed = subscribed;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
