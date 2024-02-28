package com.herd.squire.services.items;

public class MagicalItemDamageApi {
    public String numDice;
    public String diceSize;
    public String modifier;
    public String damageType;

    public MagicalItemDamageApi(String numDice, String diceSize, String modifier, String damageType) {
        this.numDice = numDice;
        this.diceSize = diceSize;
        this.modifier = modifier;
        this.damageType = damageType;
    }
}
