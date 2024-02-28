package com.herd.squire.models.attributes;

public class Alignment extends Attribute {
    public Alignment() {}

    public Alignment(String id, String name, String description, int sid, boolean author, int version) {
        super(id, name, description, AttributeType.ALIGNMENT, sid, author, version);
    }
}
