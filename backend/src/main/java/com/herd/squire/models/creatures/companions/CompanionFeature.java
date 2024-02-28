package com.herd.squire.models.creatures.companions;

import com.herd.squire.models.creatures.CreaturePower;
import com.herd.squire.models.monsters.MonsterFeature;
import com.herd.squire.models.powers.PowerType;

import java.util.ArrayList;

public class CompanionFeature extends CreaturePower {
    private MonsterFeature monsterFeature;

    public CompanionFeature() {
        super();
    }

    public CompanionFeature(String powerId, MonsterFeature monsterFeature) {
        super(powerId, PowerType.MONSTER_FEATURE, "0");
        this.monsterFeature = monsterFeature;
    }

    public CompanionFeature(String id, String powerId, String powerName, boolean active, String activeTargetCreatureId, int usesRemaining, MonsterFeature monsterFeature) {
        super(id, powerId, powerName, PowerType.MONSTER_FEATURE, null, "0", false, active, activeTargetCreatureId, usesRemaining, false, false, new ArrayList<>(), false, 0, false);
        this.monsterFeature = monsterFeature;
    }

    public MonsterFeature getMonsterFeature() {
        return monsterFeature;
    }

    public void setMonsterFeature(MonsterFeature monsterFeature) {
        this.monsterFeature = monsterFeature;
    }
}
