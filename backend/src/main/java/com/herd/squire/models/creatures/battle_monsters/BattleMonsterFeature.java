package com.herd.squire.models.creatures.battle_monsters;

import com.herd.squire.models.LimitedUseType;
import com.herd.squire.models.creatures.CreaturePower;
import com.herd.squire.models.powers.PowerType;

import java.util.ArrayList;

public class BattleMonsterFeature extends CreaturePower {
    private int rechargeMin;
    private int rechargeMax;
    public BattleMonsterFeature() {
        super();
    }

    public BattleMonsterFeature(String id, String powerId, String powerName, boolean hidden,
                                boolean active, String activeTargetCreatureId, int usesRemaining,
                                int limitedUseQuantity, LimitedUseType limitedUseType,
                                int rechargeMin, int rechargeMax) {
        super(id, powerId, powerName, PowerType.MONSTER_FEATURE, null, null, hidden, active,
                activeTargetCreatureId, usesRemaining, false, false,
                new ArrayList<>(), false, 0, false);

        if (limitedUseType == LimitedUseType.RECHARGE) {
            this.calculatedMax = 1;
            this.rechargeMin = rechargeMin;
            this.rechargeMax = rechargeMax;
        } else {
            this.calculatedMax = limitedUseQuantity;
            this.rechargeMin = 0;
            this.rechargeMax = 0;
        }
    }

    public int getRechargeMin() {
        return rechargeMin;
    }

    public void setRechargeMin(int rechargeMin) {
        this.rechargeMin = rechargeMin;
    }

    public int getRechargeMax() {
        return rechargeMax;
    }

    public void setRechargeMax(int rechargeMax) {
        this.rechargeMax = rechargeMax;
    }
}
