package com.herd.squire.models.attributes;

public class SpellSchool extends Attribute {
    public SpellSchool() {}

    public SpellSchool(String id, String name, String description, int sid, boolean author, int version) {
        super(id, name, description, AttributeType.SPELL_SCHOOL, sid, author, version);
    }
}
