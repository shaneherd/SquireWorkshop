package com.herd.squire.models.damages;

import com.herd.squire.models.attributes.DamageType;

public class DamageModifier {
    private DamageType damageType;
    private DamageModifierType damageModifierType;
    private String condition;

    public DamageModifier() {}

    public DamageModifier(DamageType damageType, DamageModifierType damageModifierType) {
        this.damageType = damageType;
        this.damageModifierType = damageModifierType;
        this.condition = "";
    }

    public DamageModifier(DamageType damageType, DamageModifierType damageModifierType, String condition) {
        this.damageType = damageType;
        this.damageModifierType = damageModifierType;
        this.condition = condition;
    }

    public DamageType getDamageType() {
        return damageType;
    }

    public void setDamageType(DamageType damageType) {
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
