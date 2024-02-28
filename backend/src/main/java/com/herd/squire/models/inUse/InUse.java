package com.herd.squire.models.inUse;

public class InUse {
    private String id;
    private String name;
    private boolean required;
    private InUseType inUseType;

    public InUse() {}

    public InUse(String id, String name, boolean required, InUseType inUseType) {
        this.id = id;
        this.name = name;
        this.required = required;
        this.inUseType = inUseType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public InUseType getInUseType() {
        return inUseType;
    }

    public void setInUseType(InUseType inUseType) {
        this.inUseType = inUseType;
    }
}
