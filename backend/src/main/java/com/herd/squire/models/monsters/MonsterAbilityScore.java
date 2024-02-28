package com.herd.squire.models.monsters;

import com.herd.squire.models.attributes.Ability;

public class MonsterAbilityScore {
    private Ability ability;
    private int value;

    public MonsterAbilityScore() {}

    public MonsterAbilityScore(Ability ability, int value) {
        this.ability = ability;
        this.value = value;
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
}
