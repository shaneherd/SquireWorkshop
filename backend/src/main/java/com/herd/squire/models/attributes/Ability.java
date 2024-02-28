package com.herd.squire.models.attributes;

public class Ability extends Attribute {
    private String abbr;

    public Ability() {}

    public Ability(String id) {
        super(id);
    }

    public Ability(String id, String name, String description, int sid, boolean author, int version, String abbr) {
        super(id, name, description, AttributeType.ABILITY, sid, author, version);
        this.abbr = abbr;
    }

    public String getAbbr() {
        return abbr;
    }

    public void setAbbr(String abbr) {
        this.abbr = abbr;
    }
}
