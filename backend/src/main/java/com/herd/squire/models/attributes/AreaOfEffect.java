package com.herd.squire.models.attributes;

public class AreaOfEffect extends Attribute {
    private boolean radius;
    private boolean width;
    private boolean height;
    private boolean length;

    public AreaOfEffect() {}

    public AreaOfEffect(String id, String name, String description, int sid, boolean author, int version, boolean radius, boolean width, boolean height, boolean length) {
        super(id, name, description, AttributeType.AREA_OF_EFFECT, sid, author, version);
        this.radius = radius;
        this.width = width;
        this.height = height;
        this.length = length;
    }

    public boolean isRadius() {
        return radius;
    }

    public void setRadius(boolean radius) {
        this.radius = radius;
    }

    public boolean isWidth() {
        return width;
    }

    public void setWidth(boolean width) {
        this.width = width;
    }

    public boolean isHeight() {
        return height;
    }

    public void setHeight(boolean height) {
        this.height = height;
    }

    public boolean isLength() {
        return length;
    }

    public void setLength(boolean length) {
        this.length = length;
    }
}
