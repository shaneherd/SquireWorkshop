package com.herd.squire.models.creatures.companions;

import com.herd.squire.models.creatures.CreaturePower;
import com.herd.squire.models.monsters.MonsterAction;
import com.herd.squire.models.powers.PowerType;

import java.util.ArrayList;

public class CompanionAction extends CreaturePower {
    private MonsterAction monsterAction;

    public CompanionAction() {
        super();
    }

    public CompanionAction(String powerId, MonsterAction monsterAction) {
        super(powerId, PowerType.MONSTER_ACTION, "0");
        this.monsterAction = monsterAction;
    }

    public CompanionAction(String id, String powerId, String powerName, boolean active, String activeTargetCreatureId, int usesRemaining, MonsterAction monsterAction) {
        super(id, powerId, powerName, PowerType.MONSTER_ACTION, null, "0", false, active, activeTargetCreatureId, usesRemaining, false, false, new ArrayList<>(), false, 0, false);
        this.monsterAction = monsterAction;
    }

    public MonsterAction getMonsterAction() {
        return monsterAction;
    }

    public void setMonsterAction(MonsterAction monsterAction) {
        this.monsterAction = monsterAction;
    }
}
