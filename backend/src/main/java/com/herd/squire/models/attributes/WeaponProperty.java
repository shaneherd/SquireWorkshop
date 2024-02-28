package com.herd.squire.models.attributes;

public class WeaponProperty extends Attribute {
    public WeaponProperty() {}

    public WeaponProperty(String id, String name, String description, int sid, boolean author, int version) {
        super(id, name, description, AttributeType.WEAPON_PROPERTY, sid, author, version);
    }
}
