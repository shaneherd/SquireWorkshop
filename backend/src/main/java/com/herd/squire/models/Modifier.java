package com.herd.squire.models;

import com.herd.squire.models.attributes.Attribute;

public class Modifier {
    private Attribute attribute;
    private int value;

    public Modifier() {}

    public Modifier(Attribute attribute) {
        this.attribute = attribute;
    }

    public Modifier(Attribute attribute, int value) {
        this.attribute = attribute;
        this.value = value;
    }

    public Attribute getAttribute() {
        return attribute;
    }

    public void setAttribute(Attribute attribute) {
        this.attribute = attribute;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
