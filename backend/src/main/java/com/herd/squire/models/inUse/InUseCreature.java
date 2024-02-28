package com.herd.squire.models.inUse;

import com.herd.squire.models.creatures.CreatureType;

public class InUseCreature extends InUse {
    private CreatureType creatureType;

    public InUseCreature() {
        super();
    }

    public InUseCreature(int subTypeId, String id, String name, boolean required) {
        super(id, name, required, InUseType.CREATURE);
        this.creatureType = CreatureType.valueOf(subTypeId);
    }

    public CreatureType getCreatureType() {
        return creatureType;
    }

    public void setCreatureType(CreatureType creatureType) {
        this.creatureType = creatureType;
    }
}
