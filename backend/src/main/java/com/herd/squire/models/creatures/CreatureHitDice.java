package com.herd.squire.models.creatures;

import com.herd.squire.models.DiceSize;

public class CreatureHitDice {
    private DiceSize diceSize;
    private int remaining;

    public CreatureHitDice() {}

    public CreatureHitDice(DiceSize diceSize, int remaining) {
        this.diceSize = diceSize;
        this.remaining = remaining;
    }

    public DiceSize getDiceSize() {
        return diceSize;
    }

    public void setDiceSize(DiceSize diceSize) {
        this.diceSize = diceSize;
    }

    public int getRemaining() {
        return remaining;
    }

    public void setRemaining(int remaining) {
        this.remaining = remaining;
    }
}
