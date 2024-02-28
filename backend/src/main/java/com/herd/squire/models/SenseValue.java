package com.herd.squire.models;

public class SenseValue {
    private Sense sense;
    private int range;

    public SenseValue() {}

    public SenseValue(Sense sense, int range) {
        this.sense = sense;
        this.range = range;
    }

    public Sense getSense() {
        return sense;
    }

    public void setSense(Sense sense) {
        this.sense = sense;
    }

    public int getRange() {
        return range;
    }

    public void setRange(int range) {
        this.range = range;
    }
}
