package com.herd.squire.models.items.magical_item;

import com.herd.squire.models.attributes.CharacterLevel;
import com.herd.squire.models.powers.SpellListObject;

public class MagicalItemSpellConfiguration {
    private SpellListObject spell;
    private boolean additional;
    private int storedLevel;
    private CharacterLevel casterLevel;
    private boolean allowCastingAtHigherLevel;
    private int charges;
    private int chargesPerLevelAboveStoredLevel;
    private int maxLevel;
    private boolean removeOnCasting;
    private boolean overrideSpellAttackCalculation;
    private int spellAttackModifier;
    private int spellSaveDC;
    private boolean active;
    private int activeLevel;
    private boolean concentrating;

    public MagicalItemSpellConfiguration() {}

    public MagicalItemSpellConfiguration(SpellListObject spell, boolean additional, int storedLevel, CharacterLevel casterLevel, boolean allowCastingAtHigherLevel,
                                         int charges, int chargesPerLevelAboveStoredLevel, int maxLevel, boolean removeOnCasting,
                                         boolean overrideSpellAttackCalculation, int spellAttackModifier, int spellSaveDC) {
        this.spell = spell;
        this.additional = additional;
        this.storedLevel = storedLevel;
        this.casterLevel = casterLevel;
        this.allowCastingAtHigherLevel = allowCastingAtHigherLevel;
        this.charges = charges;
        this.chargesPerLevelAboveStoredLevel = chargesPerLevelAboveStoredLevel;
        this.maxLevel = maxLevel;
        this.removeOnCasting = removeOnCasting;
        this.overrideSpellAttackCalculation = overrideSpellAttackCalculation;
        this.spellAttackModifier = spellAttackModifier;
        this.spellSaveDC = spellSaveDC;
//        this.active = active;
//        this.activeLevel = activeLevel;
//        this.concentrating = false;
    }

    public SpellListObject getSpell() {
        return spell;
    }

    public void setSpell(SpellListObject spell) {
        this.spell = spell;
    }

    public boolean isAdditional() {
        return additional;
    }

    public void setAdditional(boolean additional) {
        this.additional = additional;
    }

    public int getStoredLevel() {
        return storedLevel;
    }

    public void setStoredLevel(int storedLevel) {
        this.storedLevel = storedLevel;
    }

    public CharacterLevel getCasterLevel() {
        return casterLevel;
    }

    public void setCasterLevel(CharacterLevel casterLevel) {
        this.casterLevel = casterLevel;
    }

    public boolean isAllowCastingAtHigherLevel() {
        return allowCastingAtHigherLevel;
    }

    public void setAllowCastingAtHigherLevel(boolean allowCastingAtHigherLevel) {
        this.allowCastingAtHigherLevel = allowCastingAtHigherLevel;
    }

    public int getCharges() {
        return charges;
    }

    public void setCharges(int charges) {
        this.charges = charges;
    }

    public int getChargesPerLevelAboveStoredLevel() {
        return chargesPerLevelAboveStoredLevel;
    }

    public void setChargesPerLevelAboveStoredLevel(int chargesPerLevelAboveStoredLevel) {
        this.chargesPerLevelAboveStoredLevel = chargesPerLevelAboveStoredLevel;
    }

    public int getMaxLevel() {
        return maxLevel;
    }

    public void setMaxLevel(int maxLevel) {
        this.maxLevel = maxLevel;
    }

    public boolean isRemoveOnCasting() {
        return removeOnCasting;
    }

    public void setRemoveOnCasting(boolean removeOnCasting) {
        this.removeOnCasting = removeOnCasting;
    }

    public boolean isOverrideSpellAttackCalculation() {
        return overrideSpellAttackCalculation;
    }

    public void setOverrideSpellAttackCalculation(boolean overrideSpellAttackCalculation) {
        this.overrideSpellAttackCalculation = overrideSpellAttackCalculation;
    }

    public int getSpellAttackModifier() {
        return spellAttackModifier;
    }

    public void setSpellAttackModifier(int spellAttackModifier) {
        this.spellAttackModifier = spellAttackModifier;
    }

    public int getSpellSaveDC() {
        return spellSaveDC;
    }

    public void setSpellSaveDC(int spellSaveDC) {
        this.spellSaveDC = spellSaveDC;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getActiveLevel() {
        return activeLevel;
    }

    public void setActiveLevel(int activeLevel) {
        this.activeLevel = activeLevel;
    }

    public boolean isConcentrating() {
        return concentrating;
    }

    public void setConcentrating(boolean concentrating) {
        this.concentrating = concentrating;
    }
}
