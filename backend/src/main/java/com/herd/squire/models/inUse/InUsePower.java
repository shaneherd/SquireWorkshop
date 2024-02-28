package com.herd.squire.models.inUse;

import com.herd.squire.models.powers.PowerType;

public class InUsePower extends InUse {
    private PowerType powerType;

    public InUsePower() {
        super();
    }

    public InUsePower(int subTypeId, String id, String name, boolean required) {
        super(id, name, required, InUseType.POWER);
        this.powerType = PowerType.valueOf(subTypeId);
    }

    public PowerType getPowerType() {
        return powerType;
    }

    public void setPowerType(PowerType powerType) {
        this.powerType = powerType;
    }
}
