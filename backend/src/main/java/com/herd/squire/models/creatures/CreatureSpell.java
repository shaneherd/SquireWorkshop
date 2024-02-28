package com.herd.squire.models.creatures;

import com.herd.squire.models.CastingTimeUnit;
import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.models.powers.PowerType;
import com.herd.squire.models.powers.SpellListObject;

import java.util.List;

public class CreatureSpell extends CreaturePower {
    private SpellListObject spell;
    private boolean prepared;
    private boolean concentrating;
    private int activeLevel;
    private CastingTimeUnit castingTimeUnit;

    private boolean innate;
    private int innateSlot;
    private int innateMaxUses;

    public CreatureSpell() {}

    public CreatureSpell(String powerId, String assignedCharacteristic) {
        super(powerId, PowerType.SPELL, assignedCharacteristic);
        this.spell = new SpellListObject();
        this.spell.setId(powerId);
    }

    public CreatureSpell(String powerId, String assignedCharacteristic, boolean innate, int innateSlot, int usesRemaining, int innateMaxUses) {
        super(powerId, PowerType.SPELL, assignedCharacteristic);
        this.spell = new SpellListObject();
        this.spell.setId(powerId);
        this.usesRemaining = usesRemaining;
        this.innate = innate;
        this.innateSlot = innateSlot;
        this.innateMaxUses = innateMaxUses;
    }

    public CreatureSpell(String id, SpellListObject spell, CharacteristicType characteristicType, String assignedCharacteristic, boolean prepared,
                         boolean active, String activeTargetCreatureId, boolean concentrating, int usesRemaining, boolean hidden,
                         boolean rechargeOnShortRest, boolean rechargeOnLongRest, List<LimitedUse> limitedUses,
                         boolean extraModifiers, int modifiersNumLevelsAboveBase, boolean advancementModifiers, int activeLevel, CastingTimeUnit castingTimeUnit) {
        super(id, spell.getId(), spell.getName(), PowerType.SPELL, characteristicType, assignedCharacteristic, hidden, active, activeTargetCreatureId,
                usesRemaining, rechargeOnShortRest, rechargeOnLongRest, limitedUses, extraModifiers, modifiersNumLevelsAboveBase, advancementModifiers);
        this.spell = spell;
        this.prepared = prepared;
        this.concentrating = concentrating;
        this.activeLevel = activeLevel;
        this.castingTimeUnit = castingTimeUnit;
    }

    public CreatureSpell(String id, SpellListObject spell, CharacteristicType characteristicType, String assignedCharacteristic, boolean prepared,
                         boolean active, String activeTargetCreatureId, boolean concentrating, int usesRemaining, boolean hidden,
                         boolean rechargeOnShortRest, boolean rechargeOnLongRest, List<LimitedUse> limitedUses,
                         boolean extraModifiers, int modifiersNumLevelsAboveBase, boolean advancementModifiers, int activeLevel, CastingTimeUnit castingTimeUnit,
                         boolean innate, int innateSlot, int innateMaxUses) {
        super(id, spell.getId(), spell.getName(), PowerType.SPELL, characteristicType, assignedCharacteristic, hidden, active, activeTargetCreatureId,
                usesRemaining, rechargeOnShortRest, rechargeOnLongRest, limitedUses, extraModifiers, modifiersNumLevelsAboveBase, advancementModifiers);
        this.spell = spell;
        this.prepared = prepared;
        this.concentrating = concentrating;
        this.activeLevel = activeLevel;
        this.castingTimeUnit = castingTimeUnit;
        this.innate = innate;
        this.innateSlot = innateSlot;
        this.innateMaxUses = innateMaxUses;
    }

    public SpellListObject getSpell() {
        return spell;
    }

    public void setSpell(SpellListObject spell) {
        this.spell = spell;
    }

    public boolean isPrepared() {
        return prepared;
    }

    public void setPrepared(boolean prepared) {
        this.prepared = prepared;
    }

    public boolean isConcentrating() {
        return concentrating;
    }

    public void setConcentrating(boolean concentrating) {
        this.concentrating = concentrating;
    }

    public int getActiveLevel() {
        return activeLevel;
    }

    public void setActiveLevel(int activeLevel) {
        this.activeLevel = activeLevel;
    }

    public CastingTimeUnit getCastingTimeUnit() {
        return castingTimeUnit;
    }

    public void setCastingTimeUnit(CastingTimeUnit castingTimeUnit) {
        this.castingTimeUnit = castingTimeUnit;
    }

    public boolean isInnate() {
        return innate;
    }

    public void setInnate(boolean innate) {
        this.innate = innate;
    }

    public int getInnateSlot() {
        return innateSlot;
    }

    public void setInnateSlot(int innateSlot) {
        this.innateSlot = innateSlot;
    }

    public int getInnateMaxUses() {
        return innateMaxUses;
    }

    public void setInnateMaxUses(int innateMaxUses) {
        this.innateMaxUses = innateMaxUses;
    }
}
