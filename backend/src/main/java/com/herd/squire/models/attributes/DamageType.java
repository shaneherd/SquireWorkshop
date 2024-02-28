package com.herd.squire.models.attributes;

public class DamageType extends Attribute {
    public DamageType() {}

    public DamageType(String id, String name, String description, int sid, boolean author, int version) {
        super(id, name, description, AttributeType.DAMAGE_TYPE, sid, author, version);
    }
}
