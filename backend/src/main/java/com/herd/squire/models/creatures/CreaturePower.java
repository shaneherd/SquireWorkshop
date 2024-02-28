package com.herd.squire.models.creatures;

import com.herd.squire.models.characteristics.CharacteristicType;
import com.herd.squire.models.powers.LimitedUse;
import com.herd.squire.models.powers.ModifierConfiguration;
import com.herd.squire.models.powers.PowerType;

import java.util.List;

public class CreaturePower {
    protected String id;
    protected String powerId;
    protected String powerName;
    protected PowerType powerType;
    protected CharacteristicType characteristicType;
    protected String assignedCharacteristic;
    protected boolean hidden;
    protected boolean active;
    protected String activeTargetCreatureId;
    protected int usesRemaining;
    protected int calculatedMax;
    protected boolean rechargeOnShortRest;
    protected boolean rechargeOnLongRest;
    protected List<LimitedUse> limitedUses;

    protected List<ModifierConfiguration> modifierConfigurations;
    protected boolean extraModifiers = false;
    protected int modifiersNumLevelsAboveBase;
    protected List<ModifierConfiguration> extraModifierConfigurations;
    protected boolean advancementModifiers = false;
    protected List<ModifierConfiguration> advancementModifierConfigurations;

    public CreaturePower() {}

    public CreaturePower(String powerId, PowerType powerType, String assignedCharacteristic) {
        this.powerId = powerId;
        this.powerType = powerType;
        this.assignedCharacteristic = assignedCharacteristic;
    }

    public CreaturePower(String id, String powerId, String powerName, PowerType powerType, CharacteristicType characteristicType,
                         String assignedCharacteristic, boolean hidden, boolean active, String activeTargetCreatureId,
                         int usesRemaining, boolean rechargeOnShortRest, boolean rechargeOnLongRest, List<LimitedUse> limitedUses,
                         boolean extraModifiers, int modifiersNumLevelsAboveBase, boolean advancementModifiers) {
        this.id = id;
        this.powerId = powerId;
        this.powerName = powerName;
        this.powerType = powerType;
        this.characteristicType = characteristicType;
        this.assignedCharacteristic = assignedCharacteristic;
        this.hidden = hidden;
        this.active = active;
        this.activeTargetCreatureId = activeTargetCreatureId;
        this.usesRemaining = usesRemaining;
        this.calculatedMax = 0;
        this.rechargeOnShortRest = rechargeOnShortRest;
        this.rechargeOnLongRest = rechargeOnLongRest;
        this.limitedUses = limitedUses;
        this.extraModifiers = extraModifiers;
        this.modifiersNumLevelsAboveBase = modifiersNumLevelsAboveBase;
        this.advancementModifiers = advancementModifiers;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPowerId() {
        return powerId;
    }

    public String getPowerName() {
        return powerName;
    }

    public void setPowerName(String powerName) {
        this.powerName = powerName;
    }

    public PowerType getPowerType() {
        return powerType;
    }

    public void setPowerType(PowerType powerType) {
        this.powerType = powerType;
    }

    public void setPowerId(String powerId) {
        this.powerId = powerId;
    }

    public CharacteristicType getCharacteristicType() {
        return characteristicType;
    }

    public void setCharacteristicType(CharacteristicType characteristicType) {
        this.characteristicType = characteristicType;
    }

    public String getAssignedCharacteristic() {
        return assignedCharacteristic;
    }

    public void setAssignedCharacteristic(String assignedCharacteristic) {
        this.assignedCharacteristic = assignedCharacteristic;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getActiveTargetCreatureId() {
        return activeTargetCreatureId;
    }

    public void setActiveTargetCreatureId(String activeTargetCreatureId) {
        this.activeTargetCreatureId = activeTargetCreatureId;
    }

    public int getUsesRemaining() {
        return usesRemaining;
    }

    public void setUsesRemaining(int usesRemaining) {
        this.usesRemaining = usesRemaining;
    }

    public int getCalculatedMax() {
        return calculatedMax;
    }

    public void setCalculatedMax(int calculatedMax) {
        this.calculatedMax = calculatedMax;
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
        this.limitedUses = limitedUses;
    }

    public List<ModifierConfiguration> getModifierConfigurations() {
        return modifierConfigurations;
    }

    public void setModifierConfigurations(List<ModifierConfiguration> modifierConfigurations) {
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
        this.advancementModifierConfigurations = advancementModifierConfigurations;
    }
}
