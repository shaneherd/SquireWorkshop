package com.herd.squire.models.attributes;

public class DeityCategory extends Attribute {
    public DeityCategory() {}

    public DeityCategory(String id, String name, String description, int sid, boolean author, int version) {
        super(id, name, description, AttributeType.DEITY_CATEGORY, sid, author, version);
    }
}
