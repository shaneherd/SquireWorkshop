package com.herd.squire.models.attributes;

import com.herd.squire.models.SpellSlots;

import java.util.ArrayList;
import java.util.List;

public class CasterType extends Attribute {
    private List<SpellSlots> spellSlots;
    private int multiClassWeight;
    private boolean roundUp;

    public CasterType() {}

    public CasterType(String id, String name, String description, int sid, boolean author, int version, int multiClassWeight, boolean roundUp) {
        super(id, name, description, AttributeType.CASTER_TYPE, sid, author, version);
        this.spellSlots = new ArrayList<>();
        this.multiClassWeight = multiClassWeight;
        this.roundUp = roundUp;
    }

    public List<SpellSlots> getSpellSlots() {
        return spellSlots;
    }

    public void setSpellSlots(List<SpellSlots> spellSlots) {
        this.spellSlots = spellSlots;
    }

    public int getMultiClassWeight() {
        return multiClassWeight;
    }

    public void setMultiClassWeight(int multiClassWeight) {
        this.multiClassWeight = multiClassWeight;
    }

    public boolean isRoundUp() {
        return roundUp;
    }

    public void setRoundUp(boolean roundUp) {
        this.roundUp = roundUp;
    }
}
