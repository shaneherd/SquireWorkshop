package com.herd.squire.services.powers;

public class DamageApi {
    public String numDice;
    public String diceSize;
    public String modifier;
    public String damageType;
    public String level;
    public boolean includeSpellcastingAbility;

    public DamageApi(String numDice, String diceSize, String modifier, String damageType, String level, boolean includeSpellcastingAbility) {
        this.numDice = numDice;
        this.diceSize = diceSize;
        this.modifier = modifier;
        this.damageType = damageType;
        this.level = level;
        this.includeSpellcastingAbility = includeSpellcastingAbility;
    }
}
