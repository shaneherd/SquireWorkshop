package com.herd.squire.models.items;

public class ItemProficiency {
    private Item item;
    private boolean proficient;
    private int miscModifier;
    private boolean advantage;
    private boolean disadvantage;
    private boolean doubleProf;
    private boolean halfProf;
    private boolean roundUp;

    public ItemProficiency() {}

    public ItemProficiency(Item item, boolean proficient, int miscModifier, boolean advantage, boolean disadvantage, boolean doubleProf, boolean halfProf, boolean roundUp) {
        this.item = item;
        this.proficient = proficient;
        this.miscModifier = miscModifier;
        this.advantage = advantage;
        this.disadvantage = disadvantage;
        this.doubleProf = doubleProf;
        this.halfProf = halfProf;
        this.roundUp = roundUp;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public boolean isProficient() {
        return proficient;
    }

    public void setProficient(boolean proficient) {
        this.proficient = proficient;
    }

    public int getMiscModifier() {
        return miscModifier;
    }

    public void setMiscModifier(int miscModifier) {
        this.miscModifier = miscModifier;
    }

    public boolean isAdvantage() {
        return advantage;
    }

    public void setAdvantage(boolean advantage) {
        this.advantage = advantage;
    }

    public boolean isDisadvantage() {
        return disadvantage;
    }

    public void setDisadvantage(boolean disadvantage) {
        this.disadvantage = disadvantage;
    }

    public boolean isDoubleProf() {
        return doubleProf;
    }

    public void setDoubleProf(boolean doubleProf) {
        this.doubleProf = doubleProf;
    }

    public boolean isHalfProf() {
        return halfProf;
    }

    public void setHalfProf(boolean halfProf) {
        this.halfProf = halfProf;
    }

    public boolean isRoundUp() {
        return roundUp;
    }

    public void setRoundUp(boolean roundUp) {
        this.roundUp = roundUp;
    }
}
