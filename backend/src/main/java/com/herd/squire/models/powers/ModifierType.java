package com.herd.squire.models.powers;

import com.herd.squire.models.attributes.Attribute;

public class ModifierType {
    private Attribute attribute;
    private ModifierCategory modifierCategory;
    private boolean characteristicDependant;

    public ModifierType() {}

    public ModifierType(Attribute attribute, ModifierCategory modifierCategory, boolean characteristicDependant) {
        this.attribute = attribute;
        this.modifierCategory = modifierCategory;
        this.characteristicDependant = characteristicDependant;
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

    public boolean isCharacteristicDependant() {
        return characteristicDependant;
    }

    public void setCharacteristicDependant(boolean characteristicDependant) {
        this.characteristicDependant = characteristicDependant;
    }
}
