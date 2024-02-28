package com.herd.squire.models.rolls;

import com.herd.squire.models.DiceSize;
import com.herd.squire.models.attributes.DamageType;

import java.util.ArrayList;
import java.util.List;

public class DiceResult {
    private DiceSize diceSize;
    private DamageType damageType;
    private int modifier;
    private List<Integer> results;
    private boolean critical;

    public DiceResult() {
        diceSize = DiceSize.ONE;
        results = new ArrayList<>();
    }

    public DiceResult(DiceSize diceSize, DamageType damageType, int modifier, List<Integer> results, boolean critical) {
        this.diceSize = diceSize;
        this.damageType = damageType;
        this.modifier = modifier;
        this.results = results;
        this.critical = critical;
    }

    public DiceSize getDiceSize() {
        return diceSize;
    }

    public void setDiceSize(DiceSize diceSize) {
        this.diceSize = diceSize;
    }

    public DamageType getDamageType() {
        return damageType;
    }

    public void setDamageType(DamageType damageType) {
        this.damageType = damageType;
    }

    public int getModifier() {
        return modifier;
    }

    public void setModifier(int modifier) {
        this.modifier = modifier;
    }

    public List<Integer> getResults() {
        return results;
    }

    public void setResults(List<Integer> results) {
        this.results = results;
    }

    public int getTotalResult() {
        int total = getModifier();
        for (Integer result : getResults()) {
            total += result == null ? 0 : result;
        }
        return total;
    }

    public void setTotalResult(int totalResult) {}

    public boolean isCritical() {
        return critical;
    }

    public void setCritical(boolean critical) {
        this.critical = critical;
    }
}
