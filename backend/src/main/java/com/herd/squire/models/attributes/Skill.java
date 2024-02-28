package com.herd.squire.models.attributes;

public class Skill extends Attribute {
    private Ability ability;

    public Skill() {}

    public Skill(String id, String name, String description, int sid, boolean author, int version, Ability ability) {
        super(id, name, description, AttributeType.SKILL, sid, author, version);
        this.ability = ability;
    }

    public Ability getAbility() {
        return ability;
    }

    public void setAbility(Ability ability) {
        this.ability = ability;
    }
}
