package com.herd.squire.models.monsters;

import com.herd.squire.models.DiceSize;

public class MonsterAttackDamage {
    private int id;
    private int quickAttackId;
    private int attackType;
    private int numDice;
    private DiceSize diceSize;
    private String damageType;
    private Integer damageAbility;
    private int damageMod;

    public MonsterAttackDamage(int id, int quickAttackId, int attackType, int numDice, DiceSize diceSize, String damageType, Integer damageAbility, int damageMod) {
        this.id = id;
        this.quickAttackId = quickAttackId;
        this.attackType = attackType;
        this.numDice = numDice;
        this.diceSize = diceSize;
        this.damageType = damageType;
        this.damageAbility = damageAbility;
        this.damageMod = damageMod;
    }

    public int getId() {
        return id;
    }

    public int getQuickAttackId() {
        return quickAttackId;
    }

    public int getAttackType() {
        return attackType;
    }

    public int getNumDice() {
        return numDice;
    }

    public DiceSize getDiceSize() {
        return diceSize;
    }

    public String getDamageType() {
        return damageType;
    }

    public Integer getDamageAbility() {
        return damageAbility;
    }

    public int getDamageMod() {
        return damageMod;
    }
}
