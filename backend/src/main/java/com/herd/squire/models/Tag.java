package com.herd.squire.models;

import com.herd.squire.models.powers.PowerType;

public class Tag {
    private String id;
    private PowerType powerType;
    private String title;
    private String color;

    public Tag() {
        this.powerType = PowerType.SPELL;
    }

    public Tag(String id, PowerType powerType, String title, String color) {
        this.id = id;
        this.powerType = powerType;
        this.title = title;
        this.color = color;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public PowerType getPowerType() {
        return powerType;
    }

    public void setPowerType(PowerType powerType) {
        this.powerType = powerType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
