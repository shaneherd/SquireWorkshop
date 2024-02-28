package com.herd.squire.models.creatures;

import java.util.ArrayList;
import java.util.List;

public class CreatureSpellList {
    private List<CreatureSpell> creatureSpells;

    public CreatureSpellList() {
        this.creatureSpells = new ArrayList<>();
    }

    public CreatureSpellList(List<CreatureSpell> creatureSpells) {
        this.creatureSpells = creatureSpells;
    }

    public List<CreatureSpell> getCreatureSpells() {
        return creatureSpells;
    }

    public void setCreatureSpells(List<CreatureSpell> creatureSpells) {
        this.creatureSpells = creatureSpells;
    }
}
