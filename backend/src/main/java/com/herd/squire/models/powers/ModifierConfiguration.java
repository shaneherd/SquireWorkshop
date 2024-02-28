package com.herd.squire.models.powers;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.attributes.Attribute;

public class ModifierConfiguration {
    private Attribute attribute;
    private ModifierCategory modifierCategory;
    private ModifierSubCategory modifierSubCategory;
    private boolean characteristicDependant;
    private int value;
    private boolean adjustment;
    private boolean proficient;
    private boolean halfProficient;
    private boolean roundUp;
    private boolean advantage;
    private boolean disadvantage;
    private boolean extra;
    private boolean characterAdvancement;
    private ListObject level;
    private ListObject abilityModifier;
    private boolean useLevel;
    private boolean useHalfLevel;

    public ModifierConfiguration() {}

    public ModifierConfiguration(Attribute attribute, ModifierCategory modifierCategory, ModifierSubCategory modifierSubCategory,
                                 boolean characteristicDependant, int value, boolean adjustment, boolean proficient,
                                 boolean halfProficient, boolean roundUp, boolean advantage, boolean disadvantage,
                                 boolean extra, boolean characterAdvancement, ListObject level, ListObject abilityModifier,
                                 boolean useLevel, boolean useHalfLevel) {
        this.attribute = attribute;
        this.modifierCategory = modifierCategory;
        this.modifierSubCategory = modifierSubCategory;
        this.characteristicDependant = characteristicDependant;
        this.value = value;
        this.adjustment = adjustment;
        this.proficient = proficient;
        this.halfProficient = halfProficient;
        this.roundUp = roundUp;
        this.advantage = advantage;
        this.disadvantage = disadvantage;
        this.extra = extra;
        this.characterAdvancement = characterAdvancement;
        this.level = level;
        this.abilityModifier = abilityModifier;
        this.useLevel = useLevel;
        this.useHalfLevel = useHalfLevel;
    }

    public Attribute getAttribute() {
        return attribute;
    }

    public void setAttribute(Attribute attribute) {
        this.attribute = attribute;
    }

    public ModifierCategory getModifierCategory() {
        return modifierCategory;
    }

    public void setModifierCategory(ModifierCategory modifierCategory) {
        this.modifierCategory = modifierCategory;
    }

    public ModifierSubCategory getModifierSubCategory() {
        return modifierSubCategory;
    }

    public void setModifierSubCategory(ModifierSubCategory modifierSubCategory) {
        this.modifierSubCategory = modifierSubCategory;
    }

    public boolean isCharacteristicDependant() {
        return characteristicDependant;
    }

    public void setCharacteristicDependant(boolean characteristicDependant) {
        this.characteristicDependant = characteristicDependant;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public boolean isAdjustment() {
        return adjustment;
    }

    public void setAdjustment(boolean adjustment) {
        this.adjustment = adjustment;
    }

    public boolean isProficient() {
        return proficient;
    }

    public void setProficient(boolean proficient) {
        this.proficient = proficient;
    }

    public boolean isHalfProficient() {
        return halfProficient;
    }

    public void setHalfProficient(boolean halfProficient) {
        this.halfProficient = halfProficient;
    }

    public boolean isRoundUp() {
        return roundUp;
    }

    public void setRoundUp(boolean roundUp) {
        this.roundUp = roundUp;
    }

    public boolean isAdvantage() {
        return advantage;
    }

    public void setAdvantage(boolean advantage) {
        this.advantage = advantage;
    }

    public boolean isDisadvantage() {
        return disadvantage;
    }

    public void setDisadvantage(boolean disadvantage) {
        this.disadvantage = disadvantage;
    }

    public boolean isExtra() {
        return extra;
    }

    public void setExtra(boolean extra) {
        this.extra = extra;
    }

    public boolean isCharacterAdvancement() {
        return characterAdvancement;
    }

    public void setCharacterAdvancement(boolean characterAdvancement) {
        this.characterAdvancement = characterAdvancement;
    }

    public ListObject getLevel() {
        return level;
    }

    public void setLevel(ListObject level) {
        this.level = level;
    }

    public ListObject getAbilityModifier() {
        return abilityModifier;
    }

    public void setAbilityModifier(ListObject abilityModifier) {
        this.abilityModifier = abilityModifier;
    }

    public boolean isUseLevel() {
        return useLevel;
    }

    public void setUseLevel(boolean useLevel) {
        this.useLevel = useLevel;
    }

    public boolean isUseHalfLevel() {
        return useHalfLevel;
    }

    public void setUseHalfLevel(boolean useHalfLevel) {
        this.useHalfLevel = useHalfLevel;
    }
}
