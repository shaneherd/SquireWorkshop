package com.herd.squire.models;

public class AndroidCodeRequest {
    private String deviceId;
    private String authenticationId;

    public AndroidCodeRequest() { }

    public AndroidCodeRequest(String deviceId, String authenticationId) {
        this.deviceId = deviceId;
        this.authenticationId = authenticationId;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getAuthenticationId() {
        return authenticationId;
    }

    public void setAuthenticationId(String authenticationId) {
        this.authenticationId = authenticationId;
    }
}
