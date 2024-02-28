package com.herd.squire.models.user;

import java.sql.Timestamp;

public class UserResponse {
    private int id;
    private boolean beta;
    private String username;
    private String email;
    private Timestamp lastLogin;
    private int numFailedLogins;
    private UserSettings userSettings;
    private UserRole userRole;
    private UserSubscription userSubscription;

    public UserResponse() {
    }

    public UserResponse(User user) {
        this.id = user.getId();
        this.beta = user.isBeta();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.lastLogin = user.getLastLogin();
        this.numFailedLogins = user.getNumFailedLogins();
        this.userSettings = user.getUserSettings();
        this.userRole = user.getUserRole();
        this.userSubscription = user.getUserSubscription();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isBeta() {
        return beta;
    }

    public void setBeta(boolean beta) {
        this.beta = beta;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Timestamp getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Timestamp lastLogin) {
        this.lastLogin = lastLogin;
    }

    public int getNumFailedLogins() {
        return numFailedLogins;
    }

    public void setNumFailedLogins(int numFailedLogins) {
        this.numFailedLogins = numFailedLogins;
    }

    public UserSettings getUserSettings() {
        return userSettings;
    }

    public void setUserSettings(UserSettings userSettings) {
        this.userSettings = userSettings;
    }

    public UserRole getUserRole() {
        return userRole;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

    public UserSubscription getUserSubscription() {
        return userSubscription;
    }

    public void setUserSubscription(UserSubscription userSubscription) {
        this.userSubscription = userSubscription;
    }
}
