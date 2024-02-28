package com.herd.squire.services.monsters.api;

import com.herd.squire.models.monsters.MonsterPowerType;
import com.herd.squire.services.powers.PowerApiService;

import java.util.ArrayList;
import java.util.List;

public class MonsterFeatureApi extends MonsterPowerApi {
    public String description;

    public MonsterFeatureApi(int id, String name, String description) {
        super(name, MonsterPowerType.FEATURE, null, 0, 0);
        this.description = description;
    }

    public MonsterFeatureApi(int id, String name, boolean limitedUse, MonsterLimitedUseType limitedUseType,
                          int numPerDay, int rechargeMin, int rechargeMax, boolean rechargeOnShortRest,
                          boolean rechargeOnLongRest, String description) {
        super(name, MonsterPowerType.FEATURE, limitedUse, limitedUseType, numPerDay, rechargeMin, rechargeMax);
        this.description = description;
    }

    public String getFeatureRow() {
        List<String> parts = new ArrayList<>();
        parts.add(id); //monster_power_id,
        parts.add(quoted(description)); //description
        return PowerApiService.getRow(parts);
    }
}
