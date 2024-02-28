package com.herd.squire.models.powers;

import com.herd.squire.models.attributes.AreaOfEffect;

public class PowerAreaOfEffect {
    private AreaOfEffect areaOfEffect;
    private int radius;
    private int width;
    private int height;
    private int length;

    public PowerAreaOfEffect() {}

    public PowerAreaOfEffect(AreaOfEffect areaOfEffect, int radius, int width, int height, int length) {
        this.areaOfEffect = areaOfEffect;
        this.radius = radius;
        this.width = width;
        this.height = height;
        this.length = length;
    }

    public AreaOfEffect getAreaOfEffect() {
        return areaOfEffect;
    }

    public void setAreaOfEffect(AreaOfEffect areaOfEffect) {
        this.areaOfEffect = areaOfEffect;
    }

    public int getRadius() {
        return radius;
    }

    public void setRadius(int radius) {
        this.radius = radius;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }
}
