package com.herd.squire.models.creatures;

public class CreatureSpellSlot {
    private int level;
    private int remaining;
    private int calculatedMax;
    private int maxModifier;

    public CreatureSpellSlot() {}

    public CreatureSpellSlot(int level, int remaining, int calculatedMax, int maxModifier) {
        this.level = level;
        this.remaining = remaining;
        this.calculatedMax = calculatedMax;
        this.maxModifier = maxModifier;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getRemaining() {
        return remaining;
    }

    public void setRemaining(int remaining) {
        this.remaining = remaining;
    }

    public int getCalculatedMax() {
        return calculatedMax;
    }

    public void setCalculatedMax(int calculatedMax) {
        this.calculatedMax = calculatedMax;
    }

    public int getMaxModifier() {
        return maxModifier;
    }

    public void setMaxModifier(int maxModifier) {
        this.maxModifier = maxModifier;
    }
}
