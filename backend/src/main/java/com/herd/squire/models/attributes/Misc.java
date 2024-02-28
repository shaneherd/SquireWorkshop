package com.herd.squire.models.attributes;

import com.herd.squire.models.powers.ModifierCategory;

public class Misc extends Attribute {
    private ModifierCategory modifierCategory;
    private boolean characteristicDependant;

    public Misc() {
        super();
        this.modifierCategory = ModifierCategory.MISC;
    }

    public Misc(String id, String name, String description, int sid, boolean author, int version, ModifierCategory modifierCategory, boolean characteristicDependant) {
        super(id, name, description, AttributeType.MISC, sid, author, version);
        this.modifierCategory = modifierCategory;
        this.characteristicDependant = characteristicDependant;
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
