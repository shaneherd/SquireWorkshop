package com.herd.squire.models;

public class Speed {
    private SpeedType speedType;
    private int value;

    public Speed() {}

    public Speed(SpeedType speedType, int value) {
        this.speedType = speedType;
        this.value = value;
    }

    public SpeedType getSpeedType() {
        return speedType;
    }

    public void setSpeedType(SpeedType speedType) {
        this.speedType = speedType;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
