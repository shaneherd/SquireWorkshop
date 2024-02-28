package com.herd.squire.models.attributes;

public class ToolCategory extends Attribute {
    public ToolCategory() {
    }

    public ToolCategory(String id, String name, String description, int sid, boolean author, int version) {
        super(id, name, description, AttributeType.TOOL_CATEGORY, sid, author, version);
    }
}
