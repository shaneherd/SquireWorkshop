package com.herd.squire.models.powers;

import com.herd.squire.models.DiceSize;
import com.herd.squire.models.LimitedUseType;
import com.herd.squire.models.ListObject;

public class LimitedUse {
    private LimitedUseType limitedUseType;
    private ListObject characterLevel;
    private int quantity;
    private String abilityModifier;
    private DiceSize diceSize;

    public LimitedUse() {}

    public LimitedUse(LimitedUseType limitedUseType, ListObject characterLevel, int quantity, String abilityModifier, DiceSize diceSize) {
        this.limitedUseType = limitedUseType;
        this.characterLevel = characterLevel;
        this.quantity = quantity;
        this.abilityModifier = abilityModifier;
        this.diceSize = diceSize;
    }

    public LimitedUseType getLimitedUseType() {
        return limitedUseType;
    }

    public void setLimitedUseType(LimitedUseType limitedUseType) {
        this.limitedUseType = limitedUseType;
    }

    public ListObject getCharacterLevel() {
        return characterLevel;
    }

    public void setCharacterLevel(ListObject characterLevel) {
        this.characterLevel = characterLevel;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getAbilityModifier() {
        return abilityModifier;
    }

    public void setAbilityModifier(String abilityModifier) {
        this.abilityModifier = abilityModifier;
    }

    public DiceSize getDiceSize() {
        return diceSize;
    }

    public void setDiceSize(DiceSize diceSize) {
        this.diceSize = diceSize;
    }
}
