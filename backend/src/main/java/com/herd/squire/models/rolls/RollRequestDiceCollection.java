package com.herd.squire.models.rolls;

import com.herd.squire.models.DiceSize;
import com.herd.squire.models.attributes.DamageType;

public class RollRequestDiceCollection {
    private int numDice;
    private DiceSize diceSize;
    private int modifier;
    private int max;
    private DamageType damageType;

    public RollRequestDiceCollection() {}

    public RollRequestDiceCollection(int numDice, DiceSize diceSize, int modifier, int max, DamageType damageType) {
        this.numDice = numDice;
        this.diceSize = diceSize;
        this.modifier = modifier;
        this.max = max;
        this.damageType = damageType;
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

    public int getModifier() {
        return modifier;
    }

    public void setModifier(int modifier) {
        this.modifier = modifier;
    }

    public DamageType getDamageType() {
        return damageType;
    }

    public void setDamageType(DamageType damageType) {
        this.damageType = damageType;
    }

    public int getMax() {
        return max;
    }

    public void setMax(int max) {
        this.max = max;
    }
}
