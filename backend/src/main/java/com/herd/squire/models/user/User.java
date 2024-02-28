package com.herd.squire.models.user;

import java.sql.Timestamp;
import java.util.Date;

public class User {
    private int id;
    private String username;
    private String password;
    private String salt;
    private String email;
    private boolean admin;
    private Timestamp lastLogin;
    private int numFailedLogins;
    private boolean emailVerified;
    private boolean locked;
    private UserRole userRole;
    private UserSettings userSettings;
    private UserSubscription userSubscription;
    private boolean beta;

    public User() {
    }

    public User(int id, String username, String password, String salt, String email,
                boolean admin, Timestamp lastLogin, int numFailedLogins, boolean emailVerified, boolean locked,
                UserRole userRole, boolean beta, UserSettings userSettings, UserSubscription userSubscription) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.salt = salt;
        this.email = email;
        this.admin = admin;
        this.lastLogin = lastLogin;
        this.numFailedLogins = numFailedLogins;
        this.emailVerified = emailVerified;
        this.locked = locked;
        this.userRole = userRole;
        this.userSettings = userSettings;
        this.userSubscription = userSubscription;
        this.beta = beta;

        if ((this.userSubscription.getType() == UserSubscriptionType.LIMITED || this.userSubscription.getType() == UserSubscriptionType.TRIAL)
                && (this.userSubscription.getExpiration() == null || this.userSubscription.getExpiration().compareTo(new Date()) < 0)) {
            this.userRole = UserRole.BASIC;
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
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

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public boolean isLocked() {
        return locked;
    }

    public void setLocked(boolean locked) {
        this.locked = locked;
    }

    public UserRole getUserRole() {
        return userRole;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

    public UserSettings getUserSettings() {
        return userSettings;
    }

    public void setUserSettings(UserSettings userSettings) {
        this.userSettings = userSettings;
    }

    public UserSubscription getUserSubscription() {
        return userSubscription;
    }

    public void setUserSubscription(UserSubscription userSubscription) {
        this.userSubscription = userSubscription;
    }

    public boolean isBeta() {
        return beta;
    }

    public void setBeta(boolean beta) {
        this.beta = beta;
    }
}
