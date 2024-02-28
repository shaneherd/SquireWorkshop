package com.herd.squire.services.monsters.api;

import com.herd.squire.models.damages.DamageModifierType;

public class MonsterDamageModifierApi {
    private String damageType;
    private DamageModifierType damageModifierType;
    private String condition;

    public MonsterDamageModifierApi(String damageType, DamageModifierType damageModifierType, String condition) {
        this.damageType = damageType;
        this.damageModifierType = damageModifierType;
        this.condition = condition;
    }

    public String getDamageType() {
        return damageType;
    }

    public void setDamageType(String damageType) {
        this.damageType = damageType;
    }

    public DamageModifierType getDamageModifierType() {
        return damageModifierType;
    }

    public void setDamageModifierType(DamageModifierType damageModifierType) {
        this.damageModifierType = damageModifierType;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }
}
