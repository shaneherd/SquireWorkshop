package com.herd.squire.models.damages;

import com.herd.squire.models.DiceCollection;
import com.herd.squire.models.ListObject;

public class DamageConfigurationSimple {
    private DiceCollection values;
    private ListObject damageType;

    public DamageConfigurationSimple() {
    }

    public DamageConfigurationSimple(DiceCollection values, ListObject damageType) {
        this.values = values;
        this.damageType = damageType;
    }

    public DiceCollection getValues() {
        return values;
    }

    public void setValues(DiceCollection values) {
        this.values = values;
    }

    public ListObject getDamageType() {
        return damageType;
    }

    public void setDamageType(ListObject damageType) {
        this.damageType = damageType;
    }
}
