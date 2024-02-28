package com.herd.squire.models.attributes;

public class Deity extends Attribute {
    private DeityCategory deityCategory;
    private Alignment alignment;
    private String symbol;

    public Deity() {}

    public Deity(String id, String name, String description, int sid, boolean author, int version, DeityCategory deityCategory, Alignment alignment, String symbol) {
        super(id, name, description, AttributeType.DEITY, sid, author, version);
        this.deityCategory = deityCategory;
        this.alignment = alignment;
        this.symbol = symbol;
    }

    public DeityCategory getDeityCategory() {
        return deityCategory;
    }

    public void setDeityCategory(DeityCategory deityCategory) {
        this.deityCategory = deityCategory;
    }

    public Alignment getAlignment() {
        return alignment;
    }

    public void setAlignment(Alignment alignment) {
        this.alignment = alignment;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
}
