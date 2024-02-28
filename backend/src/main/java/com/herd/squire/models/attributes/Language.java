package com.herd.squire.models.attributes;

public class Language extends Attribute {
    private String script;

    public Language() {}

    public Language(String id, String name, String description, int sid, boolean author, int version, String script) {
        super(id, name, description, AttributeType.LANGUAGE, sid, author, version);
        this.script = script;
    }

    public String getScript() {
        return script;
    }

    public void setScript(String script) {
        this.script = script;
    }
}
