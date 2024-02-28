package com.herd.squire.models.attributes;

public class CharacterLevel extends Attribute {
    private int minExp;
    private int profBonus;

    public CharacterLevel() { }

    public CharacterLevel(String id, String name, String description, int sid, boolean author, int version, int minExp, int profBonus) {
        super(id, name, description, AttributeType.LEVEL, sid, author, version);
        this.minExp = minExp;
        this.profBonus = profBonus;
    }

    public int getMinExp() {
        return minExp;
    }

    public void setMinExp(int minExp) {
        this.minExp = minExp;
    }

    public int getProfBonus() {
        return profBonus;
    }

    public void setProfBonus(int profBonus) {
        this.profBonus = profBonus;
    }
}
