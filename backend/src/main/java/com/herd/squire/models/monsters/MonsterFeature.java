package com.herd.squire.models.monsters;

import com.herd.squire.models.powers.LimitedUse;

public class MonsterFeature extends MonsterPower {
    private String description;

    public MonsterFeature(){
    }

    public MonsterFeature(String id, String name, int sid, boolean author, int version,
                          LimitedUse limitedUse, int rechargeMin, int rechargeMax,
                          String description) {
        super(id, name, sid, author, version, MonsterPowerType.FEATURE, limitedUse, rechargeMin, rechargeMax);
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
