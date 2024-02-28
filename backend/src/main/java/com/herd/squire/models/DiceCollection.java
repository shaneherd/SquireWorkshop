package com.herd.squire.models;

import com.herd.squire.models.attributes.Ability;

public class DiceCollection {
    private int numDice;
    private DiceSize diceSize;
    private Ability abilityModifier;
    private int miscModifier;

    public DiceCollection() {}

    public DiceCollection(int numDice, DiceSize diceSize, Ability abilityModifier, int miscModifier) {
        this.numDice = numDice;
        this.diceSize = diceSize;
        this.abilityModifier = abilityModifier;
        this.miscModifier = miscModifier;
    }

    public int getNumDice() {
        return numDice;
    }

    public void setNumDice(int numDice) {
        this.numDice = numDice;
    }

    public DiceSize getDiceSize() {
        return diceSize;
    }

    public void setDiceSize(DiceSize diceSize) {
        this.diceSize = diceSize;
    }

    public Ability getAbilityModifier() {
        return abilityModifier;
    }

    public void setAbilityModifier(Ability abilityModifier) {
        this.abilityModifier = abilityModifier;
    }

    public int getMiscModifier() {
        return miscModifier;
    }

    public void setMiscModifier(int miscModifier) {
        this.miscModifier = miscModifier;
    }
}
