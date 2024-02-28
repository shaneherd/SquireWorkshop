package com.herd.squire.models.creatures.battle_monsters;

import com.herd.squire.models.Action;
import com.herd.squire.models.LimitedUseType;
import com.herd.squire.models.creatures.CreaturePower;
import com.herd.squire.models.powers.PowerType;

import java.util.ArrayList;

public class BattleMonsterAction extends CreaturePower {
    private Action actionType;
    private int legendaryCost;
    private int rechargeMin;
    private int rechargeMax;

    public BattleMonsterAction() {
        super();
    }

    public BattleMonsterAction(String id, String powerId, String powerName, boolean hidden,
                               boolean active, String activeTargetCreatureId, int usesRemaining,
                               int limitedUseQuantity, LimitedUseType limitedUseType,
                               Action actionType, int legendaryCost, int rechargeMin, int rechargeMax) {
        super(id, powerId, powerName, PowerType.MONSTER_ACTION, null, null, hidden, active,
                activeTargetCreatureId, usesRemaining, false, false,
                new ArrayList<>(), false, 0, false);

        this.actionType = actionType;
        this.legendaryCost = legendaryCost;

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

    public Action getActionType() {
        return actionType;
    }

    public void setActionType(Action actionType) {
        this.actionType = actionType;
    }

    public int getLegendaryCost() {
        return legendaryCost;
    }

    public void setLegendaryCost(int legendaryCost) {
        this.legendaryCost = legendaryCost;
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
