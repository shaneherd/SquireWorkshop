package com.herd.squire.models.powers;

import com.herd.squire.models.attributes.Ability;
import com.herd.squire.models.damages.DamageConfiguration;
import org.codehaus.jackson.annotate.JsonSubTypes;
import org.codehaus.jackson.annotate.JsonTypeInfo;

import java.util.ArrayList;
import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Spell.class, name = "Spell"),
        @JsonSubTypes.Type(value = Feature.class, name = "Feature")
})
public class Power {
    protected String id;
    protected String name;
    protected int sid;
    protected boolean author;
    protected int version;

    protected PowerType powerType;
    protected AttackType attackType;
    protected boolean temporaryHP;
    protected int attackMod;
    protected String attackAbilityModifier;
    protected Ability saveType;
    protected boolean halfOnSave;
    protected List<DamageConfiguration> damageConfigurations;
    protected boolean extraDamage;
    protected int numLevelsAboveBase;
    protected List<DamageConfiguration> extraDamageConfigurations;
    protected boolean advancement;
    protected List<DamageConfiguration> advancementDamageConfigurations;
    protected List<ModifierConfiguration> modifierConfigurations;
    protected boolean extraModifiers = false;
    protected int modifiersNumLevelsAboveBase;
    protected List<ModifierConfiguration> extraModifierConfigurations;
    protected boolean advancementModifiers = false;
    protected List<ModifierConfiguration> advancementModifierConfigurations;
    protected boolean saveProficiencyModifier;
    protected String saveAbilityModifier;

    protected RangeType rangeType;
    protected int range;
    protected RangeUnit rangeUnit;
    protected PowerAreaOfEffect powerAreaOfEffect;
    protected int rechargeMin;
    protected int rechargeMax;
    protected boolean rechargeOnShortRest;
    protected boolean rechargeOnLongRest;
    protected List<LimitedUse> limitedUses;

    public Power() {}

    public Power(String id, String name, int sid, boolean author, int version,
                 PowerType powerType, AttackType attackType, boolean temporaryHP, int attackMod, String attackAbilityModifier, Ability saveType,
                 boolean halfOnSave, boolean extraDamage, int numLevelsAboveBase,
                 boolean saveProficiencyModifier, String saveAbilityModifier, RangeType rangeType, int range, RangeUnit rangeUnit,
                 PowerAreaOfEffect powerAreaOfEffect, int rechargeMin, int rechargeMax, boolean rechargeOnShortRest,
                 boolean rechargeOnLongRest, boolean advancement, boolean extraModifiers, int modifiersNumLevelsAboveBase,
                 boolean advancementModifiers) {
        this.id = id;
        this.name = name;
        this.sid = sid;
        this.author = author;
        this.version = version;

        this.powerType = powerType;
        this.attackType = attackType;
        this.temporaryHP = temporaryHP;
        this.attackMod = attackMod;
        this.attackAbilityModifier = attackAbilityModifier;
        this.saveType = saveType;
        this.halfOnSave = halfOnSave;
        this.extraDamage = extraDamage;
        this.numLevelsAboveBase = numLevelsAboveBase;
        this.advancement = advancement;
        this.extraModifiers = extraModifiers;
        this.modifiersNumLevelsAboveBase = modifiersNumLevelsAboveBase;
        this.advancementModifiers = advancementModifiers;
        this.saveProficiencyModifier = saveProficiencyModifier;
        this.saveAbilityModifier = saveAbilityModifier;
        this.rangeType = rangeType;
        this.range = range;
        this.rangeUnit = rangeUnit;
        this.powerAreaOfEffect = powerAreaOfEffect;
        this.rechargeMin = rechargeMin;
        this.rechargeMax = rechargeMax;
        this.rechargeOnLongRest = rechargeOnLongRest;
        this.rechargeOnShortRest = rechargeOnShortRest;

        this.damageConfigurations = new ArrayList<>();
        this.extraDamageConfigurations = new ArrayList<>();
        this.advancementDamageConfigurations = new ArrayList<>();

        this.modifierConfigurations = new ArrayList<>();
        this.extraModifierConfigurations = new ArrayList<>();
        this.advancementModifierConfigurations = new ArrayList<>();

        this.limitedUses = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSid() {
        return sid;
    }

    public void setSid(int sid) {
        this.sid = sid;
    }

    public boolean isAuthor() {
        return author;
    }

    public void setAuthor(boolean author) {
        this.author = author;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public PowerType getPowerType() {
        return powerType;
    }

    public void setPowerType(PowerType powerType) {
        this.powerType = powerType;
    }

    public AttackType getAttackType() {
        return attackType;
    }

    public void setAttackType(AttackType attackType) {
        this.attackType = attackType;
    }

    public boolean isTemporaryHP() {
        return temporaryHP;
    }

    public void setTemporaryHP(boolean temporaryHP) {
        this.temporaryHP = temporaryHP;
    }

    public int getAttackMod() {
        return attackMod;
    }

    public void setAttackMod(int attackMod) {
        this.attackMod = attackMod;
    }

    public String getAttackAbilityModifier() {
        return attackAbilityModifier;
    }

    public void setAttackAbilityModifier(String attackAbilityModifier) {
        this.attackAbilityModifier = attackAbilityModifier;
    }

    public Ability getSaveType() {
        return saveType;
    }

    public void setSaveType(Ability saveType) {
        this.saveType = saveType;
    }

    public boolean isHalfOnSave() {
        return halfOnSave;
    }

    public void setHalfOnSave(boolean halfOnSave) {
        this.halfOnSave = halfOnSave;
    }

    public List<DamageConfiguration> getDamageConfigurations() {
        return damageConfigurations;
    }

    public void setDamageConfigurations(List<DamageConfiguration> damageConfigurations) {
        if (damageConfigurations == null) {
            damageConfigurations = new ArrayList<>();
        }
        this.damageConfigurations = damageConfigurations;
    }

    public boolean isExtraDamage() {
        return extraDamage;
    }

    public void setExtraDamage(boolean extraDamage) {
        this.extraDamage = extraDamage;
    }

    public int getNumLevelsAboveBase() {
        return numLevelsAboveBase;
    }

    public void setNumLevelsAboveBase(int numLevelsAboveBase) {
        this.numLevelsAboveBase = numLevelsAboveBase;
    }

    public boolean isSaveProficiencyModifier() {
        return saveProficiencyModifier;
    }

    public void setSaveProficiencyModifier(boolean saveProficiencyModifier) {
        this.saveProficiencyModifier = saveProficiencyModifier;
    }

    public String getSaveAbilityModifier() {
        return saveAbilityModifier;
    }

    public void setSaveAbilityModifier(String saveAbilityModifier) {
        this.saveAbilityModifier = saveAbilityModifier;
    }

    public List<DamageConfiguration> getExtraDamageConfigurations() {
        return extraDamageConfigurations;
    }

    public void setExtraDamageConfigurations(List<DamageConfiguration> extraDamageConfigurations) {
        if (extraDamageConfigurations == null) {
            extraDamageConfigurations = new ArrayList<>();
        }
        this.extraDamageConfigurations = extraDamageConfigurations;
    }

    public boolean isAdvancement() {
        return advancement;
    }

    public void setAdvancement(boolean advancement) {
        this.advancement = advancement;
    }

    public List<DamageConfiguration> getAdvancementDamageConfigurations() {
        return advancementDamageConfigurations;
    }

    public void setAdvancementDamageConfigurations(List<DamageConfiguration> advancementDamageConfigurations) {
        if (advancementDamageConfigurations == null) {
            advancementDamageConfigurations = new ArrayList<>();
        }
        this.advancementDamageConfigurations = advancementDamageConfigurations;
    }

    public List<ModifierConfiguration> getModifierConfigurations() {
        return modifierConfigurations;
    }

    public void setModifierConfigurations(List<ModifierConfiguration> modifierConfigurations) {
        if (modifierConfigurations == null) {
            modifierConfigurations = new ArrayList<>();
        }
        this.modifierConfigurations = modifierConfigurations;
    }

    public boolean isExtraModifiers() {
        return extraModifiers;
    }

    public void setExtraModifiers(boolean extraModifiers) {
        this.extraModifiers = extraModifiers;
    }

    public int getModifiersNumLevelsAboveBase() {
        return modifiersNumLevelsAboveBase;
    }

    public void setModifiersNumLevelsAboveBase(int modifiersNumLevelsAboveBase) {
        this.modifiersNumLevelsAboveBase = modifiersNumLevelsAboveBase;
    }

    public List<ModifierConfiguration> getExtraModifierConfigurations() {
        return extraModifierConfigurations;
    }

    public void setExtraModifierConfigurations(List<ModifierConfiguration> extraModifierConfigurations) {
        if (extraModifierConfigurations == null) {
            extraModifierConfigurations = new ArrayList<>();
        }
        this.extraModifierConfigurations = extraModifierConfigurations;
    }

    public boolean isAdvancementModifiers() {
        return advancementModifiers;
    }

    public void setAdvancementModifiers(boolean advancementModifiers) {
        this.advancementModifiers = advancementModifiers;
    }

    public List<ModifierConfiguration> getAdvancementModifierConfigurations() {
        return advancementModifierConfigurations;
    }

    public void setAdvancementModifierConfigurations(List<ModifierConfiguration> advancementModifierConfigurations) {
        if (advancementModifierConfigurations == null) {
            advancementModifierConfigurations = new ArrayList<>();
        }
        this.advancementModifierConfigurations = advancementModifierConfigurations;
    }

    public RangeType getRangeType() {
        return rangeType;
    }

    public void setRangeType(RangeType rangeType) {
        this.rangeType = rangeType;
    }

    public int getRange() {
        return range;
    }

    public void setRange(int range) {
        this.range = range;
    }

    public RangeUnit getRangeUnit() {
        return rangeUnit;
    }

    public void setRangeUnit(RangeUnit rangeUnit) {
        this.rangeUnit = rangeUnit;
    }

    public PowerAreaOfEffect getPowerAreaOfEffect() {
        return powerAreaOfEffect;
    }

    public void setPowerAreaOfEffect(PowerAreaOfEffect powerAreaOfEffect) {
        this.powerAreaOfEffect = powerAreaOfEffect;
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

    public boolean isRechargeOnShortRest() {
        return rechargeOnShortRest;
    }

    public void setRechargeOnShortRest(boolean rechargeOnShortRest) {
        this.rechargeOnShortRest = rechargeOnShortRest;
    }

    public boolean isRechargeOnLongRest() {
        return rechargeOnLongRest;
    }

    public void setRechargeOnLongRest(boolean rechargeOnLongRest) {
        this.rechargeOnLongRest = rechargeOnLongRest;
    }

    public List<LimitedUse> getLimitedUses() {
        return limitedUses;
    }

    public void setLimitedUses(List<LimitedUse> limitedUses) {
        if (limitedUses == null) {
            limitedUses = new ArrayList<>();
        }
        this.limitedUses = limitedUses;
    }
}
