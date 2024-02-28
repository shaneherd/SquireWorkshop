package com.herd.squire.models.attributes;

public class WeaponType extends Attribute {
    public WeaponType() {
    }

    public WeaponType(String id, String name, String description, int sid, boolean author, int version) {
        super(id, name, description, AttributeType.WEAPON_TYPE, sid, author, version);
    }
}
