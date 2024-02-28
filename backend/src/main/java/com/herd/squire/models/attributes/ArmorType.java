package com.herd.squire.models.attributes;

import com.herd.squire.models.TimeUnit;

public class ArmorType extends Attribute {
    private int don;
    private TimeUnit donTimeUnit;
    private int doff;
    private TimeUnit doffTimeUnit;

    public ArmorType() {}

    public ArmorType(String id, String name, String description, int sid, boolean author, int version, int don, TimeUnit donTimeUnit, int doff, TimeUnit doffTimeUnit) {
        super(id, name, description, AttributeType.ARMOR_TYPE, sid, author, version);
        this.don = don;
        this.donTimeUnit = donTimeUnit;
        this.doff = doff;
        this.doffTimeUnit = doffTimeUnit;
    }

    public int getDon() {
        return don;
    }

    public void setDon(int don) {
        this.don = don;
    }

    public TimeUnit getDonTimeUnit() {
        return donTimeUnit;
    }

    public void setDonTimeUnit(TimeUnit donTimeUnit) {
        this.donTimeUnit = donTimeUnit;
    }

    public int getDoff() {
        return doff;
    }

    public void setDoff(int doff) {
        this.doff = doff;
    }

    public TimeUnit getDoffTimeUnit() {
        return doffTimeUnit;
    }

    public void setDoffTimeUnit(TimeUnit doffTimeUnit) {
        this.doffTimeUnit = doffTimeUnit;
    }
}
