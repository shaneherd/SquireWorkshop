package com.herd.squire.models.creatures;

import java.util.List;

public class CreatureSpellSlots {
    private List<CreatureSpellSlot> spellSlots;

    public CreatureSpellSlots() {}

    public CreatureSpellSlots(List<CreatureSpellSlot> spellSlots) {
        this.spellSlots = spellSlots;
    }

    public List<CreatureSpellSlot> getSpellSlots() {
        return spellSlots;
    }

    public void setSpellSlots(List<CreatureSpellSlot> spellSlots) {
        this.spellSlots = spellSlots;
    }
}
