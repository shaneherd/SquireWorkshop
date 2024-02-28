package com.herd.squire.models.rolls;

public class AttackDamageRollRequest {
    private RollRequest attack;
    private RollRequest damage;

    public AttackDamageRollRequest() {}

    public AttackDamageRollRequest(RollRequest attack, RollRequest damage) {
        this.attack = attack;
        this.damage = damage;
    }

    public RollRequest getAttack() {
        return attack;
    }

    public void setAttack(RollRequest attack) {
        this.attack = attack;
    }

    public RollRequest getDamage() {
        return damage;
    }

    public void setDamage(RollRequest damage) {
        this.damage = damage;
    }
}
