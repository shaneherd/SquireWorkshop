package com.herd.squire.models.powers;

import com.herd.squire.models.CastingTimeUnit;
import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.attributes.SpellSchool;

public class Spell extends Power {
    private int level;
    private SpellSchool spellSchool;
    private boolean ritual;
    private int castingTime;
    private CastingTimeUnit castingTimeUnit;
    private boolean verbal;
    private boolean somatic;
    private boolean material;
    private String components;
    private boolean instantaneous;
    private boolean concentration;
    private String duration;
    private String description;
    private String higherLevels;

    public Spell() {}

    public Spell(String id, String name, int sid, boolean author, int version,
                 AttackType attackType, boolean temporaryHP, int attackMod, Ability saveType,
                 boolean halfOnSave, boolean extraDamage, int numLevelsAboveBase,
                 boolean advancement, boolean extraModifiers, int modifiersNumLevelsAboveBase, boolean advancementModifiers,
                 int level, SpellSchool spellSchool, boolean ritual, int castingTime,
                 CastingTimeUnit castingTimeUnit, RangeType rangeType, int range, RangeUnit rangeUnit,
                 PowerAreaOfEffect powerAreaOfEffect, boolean verbal,
                 boolean somatic, boolean material, String components, boolean instantaneous, boolean concentration,
                 String duration, String description, String higherLevels) {
        super(id, name, sid, author, version, PowerType.SPELL, attackType, temporaryHP, attackMod, "0", saveType, halfOnSave,
                extraDamage, numLevelsAboveBase, false, "0",
                rangeType, range, rangeUnit, powerAreaOfEffect, 0, 0, false, false,
                advancement,
                extraModifiers, modifiersNumLevelsAboveBase, advancementModifiers);
        this.level = level;
        this.spellSchool = spellSchool;
        this.ritual = ritual;
        this.castingTime = castingTime;
        this.castingTimeUnit = castingTimeUnit;
        this.verbal = verbal;
        this.somatic = somatic;
        this.material = material;
        this.components = components;
        this.instantaneous = instantaneous;
        this.concentration = concentration;
        this.duration = duration;
        this.description = description;
        this.higherLevels = higherLevels;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public SpellSchool getSpellSchool() {
        return spellSchool;
    }

    public void setSpellSchool(SpellSchool spellSchool) {
        this.spellSchool = spellSchool;
    }

    public boolean isRitual() {
        return ritual;
    }

    public void setRitual(boolean ritual) {
        this.ritual = ritual;
    }

    public int getCastingTime() {
        return castingTime;
    }

    public void setCastingTime(int castingTime) {
        this.castingTime = castingTime;
    }

    public CastingTimeUnit getCastingTimeUnit() {
        return castingTimeUnit;
    }

    public void setCastingTimeUnit(CastingTimeUnit castingTimeUnit) {
        this.castingTimeUnit = castingTimeUnit;
    }

    public boolean isVerbal() {
        return verbal;
    }

    public void setVerbal(boolean verbal) {
        this.verbal = verbal;
    }

    public boolean isSomatic() {
        return somatic;
    }

    public void setSomatic(boolean somatic) {
        this.somatic = somatic;
    }

    public boolean isMaterial() {
        return material;
    }

    public void setMaterial(boolean material) {
        this.material = material;
    }

    public String getComponents() {
        return components;
    }

    public void setComponents(String components) {
        this.components = components;
    }

    public boolean isInstantaneous() {
        return instantaneous;
    }

    public void setInstantaneous(boolean instantaneous) {
        this.instantaneous = instantaneous;
    }

    public boolean isConcentration() {
        return concentration;
    }

    public void setConcentration(boolean concentration) {
        this.concentration = concentration;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getHigherLevels() {
        return higherLevels;
    }

    public void setHigherLevels(String higherLevels) {
        this.higherLevels = higherLevels;
    }
}
