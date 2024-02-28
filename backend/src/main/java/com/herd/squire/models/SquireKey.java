package com.herd.squire.models;

import java.util.UUID;

public class SquireKey {
    private UUID token;
    private int credits;
    private boolean used;

    public SquireKey(UUID token, int credits) {
        this.token = token;
        this.credits = credits;
        this.used = false;
    }

    public SquireKey(UUID token, int credits, boolean used) {
        this.token = token;
        this.credits = credits;
        this.used = used;
    }

    public UUID getToken() {
        return token;
    }

    public void setToken(UUID token) {
        this.token = token;
    }

    public int getCredits() {
        return credits;
    }

    public void setCredits(int credits) {
        this.credits = credits;
    }

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }
}
