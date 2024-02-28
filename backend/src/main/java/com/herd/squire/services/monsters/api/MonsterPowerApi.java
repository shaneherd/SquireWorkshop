package com.herd.squire.services.monsters.api;

import com.herd.squire.models.LimitedUseType;
import com.herd.squire.models.monsters.MonsterPowerType;
import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.services.powers.PowerApiService;

import java.util.ArrayList;
import java.util.List;

public class MonsterPowerApi {
    private String sid;
    public String id;
    public String name;
    public MonsterPowerType monsterPowerType;
    public LimitedUse limitedUse;
    public int rechargeMin;
    public int rechargeMax;

    public MonsterPowerApi(String name, MonsterPowerType monsterPowerType, boolean limitedUse, MonsterLimitedUseType limitedUseType, int quantity, int rechargeMin, int rechargeMax) {
        this.name = name;
        this.monsterPowerType = monsterPowerType;
        if (!limitedUse) {
            this.limitedUse = null;
        } else {
            this.limitedUse = new LimitedUse(getLimitedUseType(limitedUseType), null, quantity, "0", null);
        }
        this.rechargeMin = rechargeMin;
        this.rechargeMax = rechargeMax;
    }

    private LimitedUseType getLimitedUseType(MonsterLimitedUseType monsterLimitedUseType) {
        switch (monsterLimitedUseType) {
            case NUM_PER_DAY:
                return LimitedUseType.QUANTITY;
            case RECHARGE_RANGE:
                return LimitedUseType.RECHARGE;
        }
        return LimitedUseType.QUANTITY;
    }

    public MonsterPowerApi(String name, MonsterPowerType monsterPowerType, LimitedUse limitedUse, int rechargeMin, int rechargeMax) {
        this.name = name;
        this.monsterPowerType = monsterPowerType;
        this.limitedUse = limitedUse;
        this.rechargeMin = rechargeMin;
        this.rechargeMax = rechargeMax;
    }

    protected String quoted(String string) {
        return "'" + string + "'";
    }

    public String getMonsterPowerRow(int sid, String monsterId) {
        this.sid = String.valueOf(sid);
        List<String> parts = new ArrayList<>();
        parts.add(quoted(name));
        parts.add(monsterId);
        parts.add(String.valueOf(monsterPowerType.getValue()));
        parts.add(limitedUse != null && limitedUse.getLimitedUseType() == LimitedUseType.RECHARGE ? String.valueOf(rechargeMin) : "0");
        parts.add(limitedUse != null && limitedUse.getLimitedUseType() == LimitedUseType.RECHARGE ? String.valueOf(rechargeMax) : "0");
        parts.add("userId");
        parts.add(String.valueOf(sid));
        return PowerApiService.getRow(parts);
    }

    public String getIdRow(String monsterId) {
        this.id = getId(monsterId);
        return "SET " + id + " = (SELECT id FROM monster_powers WHERE user_id = userId AND sid = " + sid + ");";
    }

    private String getId(String monsterId) {
        String powerId = PowerApiService.getIdValue(name);
        return monsterId.substring(0, monsterId.length() - 2) + powerId.substring(1);
    }

    public String getLimitedUseRow() {
        List<String> parts = new ArrayList<>();
        if (limitedUse != null) {
            parts.add(id); //monster_power_id,
            parts.add(String.valueOf(limitedUse.getLimitedUseType().getValue())); //limited_use_type_id,
            parts.add(limitedUse.getLimitedUseType() == LimitedUseType.RECHARGE ? "1" : String.valueOf(limitedUse.getQuantity())); //quantity,
            parts.add("null"); //ability_modifier_id,
            parts.add("null"); //dice_size_id
        }
        return PowerApiService.getRow(parts);
    }
}
