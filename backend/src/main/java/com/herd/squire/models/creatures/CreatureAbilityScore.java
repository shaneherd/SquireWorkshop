package com.herd.squire.models.creatures;

import com.herd.squire.models.attributes.Ability;

public class CreatureAbilityScore {
    private Ability ability;
    private int value;
    private int miscModifier;
    private int asiModifier;

    public CreatureAbilityScore() {}

    public CreatureAbilityScore(Ability ability, int value, int miscModifier, int asiModifier) {
        this.ability = ability;
        this.value = value;
        this.miscModifier = miscModifier;
        this.asiModifier = asiModifier;
    }

    public Ability getAbility() {
        return ability;
    }

    public void setAbility(Ability ability) {
        this.ability = ability;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public int getMiscModifier() {
        return miscModifier;
    }

    public void setMiscModifier(int miscModifier) {
        this.miscModifier = miscModifier;
    }

    public int getAsiModifier() {
        return asiModifier;
    }

    public void setAsiModifier(int asiModifier) {
        this.asiModifier = asiModifier;
    }
}
