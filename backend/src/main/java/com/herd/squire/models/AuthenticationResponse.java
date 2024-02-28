package com.herd.squire.models;

import com.herd.squire.models.user.User;
import com.herd.squire.models.user.UserResponse;

import java.sql.Timestamp;

public class AuthenticationResponse {
    private String token;
    private Timestamp lastLogin;
    private int numFailedLogins;
    private UserResponse user;

    public AuthenticationResponse() {
    }

    public AuthenticationResponse(String token) {
        this.token = token;
        this.numFailedLogins = 0;
        this.lastLogin = null;
        this.user = null;
    }

    public AuthenticationResponse(String token, Timestamp lastLogin, int numFailedLogins, User user) {
        UserResponse userResponse = new UserResponse(user);
        this.token = token;
        this.lastLogin = lastLogin;
        this.numFailedLogins = numFailedLogins;
        this.user = userResponse;
    }

    public AuthenticationResponse(String token, Timestamp lastLogin, int numFailedLogins, UserResponse user) {
        this.token = token;
        this.lastLogin = lastLogin;
        this.numFailedLogins = numFailedLogins;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}
