package com.herd.squire.models.damages;

import com.herd.squire.models.DiceCollection;
import com.herd.squire.models.ListObject;
import com.herd.squire.models.attributes.DamageType;

public class DamageConfiguration {
    private boolean characterAdvancement;
    private boolean extra;
    private ListObject level;
    private DiceCollection values;
    private DamageType damageType;
    private boolean healing;
    private boolean versatile;
    private boolean spellCastingAbilityModifier;
    private boolean adjustment;

    public DamageConfiguration() {}

    public DamageConfiguration(boolean characterAdvancement, boolean extra, ListObject level, DiceCollection values,
                               DamageType damageType, boolean healing, boolean versatile,
                               boolean spellCastingAbilityModifier, boolean adjustment) {
        this.characterAdvancement = characterAdvancement;
        this.extra = extra;
        this.level = level;
        this.values = values;
        this.damageType = damageType;
        this.healing = healing;
        this.versatile = versatile;
        this.spellCastingAbilityModifier = spellCastingAbilityModifier;
        this.adjustment = adjustment;
    }

    public boolean isCharacterAdvancement() {
        return characterAdvancement;
    }

    public void setCharacterAdvancement(boolean characterAdvancement) {
        this.characterAdvancement = characterAdvancement;
    }

    public boolean isExtra() {
        return extra;
    }

    public void setExtra(boolean extra) {
        this.extra = extra;
    }

    public ListObject getLevel() {
        return level;
    }

    public void setLevel(ListObject level) {
        this.level = level;
    }

    public DiceCollection getValues() {
        return values;
    }

    public void setValues(DiceCollection values) {
        this.values = values;
    }

    public DamageType getDamageType() {
        return damageType;
    }

    public void setDamageType(DamageType damageType) {
        this.damageType = damageType;
    }

    public boolean isHealing() {
        return healing;
    }

    public void setHealing(boolean healing) {
        this.healing = healing;
    }

    public boolean isVersatile() {
        return versatile;
    }

    public void setVersatile(boolean versatile) {
        this.versatile = versatile;
    }

    public boolean isSpellCastingAbilityModifier() {
        return spellCastingAbilityModifier;
    }

    public void setSpellCastingAbilityModifier(boolean spellCastingAbilityModifier) {
        this.spellCastingAbilityModifier = spellCastingAbilityModifier;
    }

    public boolean isAdjustment() {
        return adjustment;
    }

    public void setAdjustment(boolean adjustment) {
        this.adjustment = adjustment;
    }
}
