package com.herd.squire.models.characteristics.character_class;

import com.herd.squire.models.attributes.Ability;

public class ClassSpellPreparation {
    private boolean requirePreparation;
    private Ability numToPrepareAbilityModifier;
    private boolean numToPrepareIncludeLevel;
    private boolean numToPrepareIncludeHalfLevel;
    private int numToPrepareMiscModifier;

    public ClassSpellPreparation() {}

    public ClassSpellPreparation(boolean requirePreparation, Ability numToPrepareAbilityModifier,
                                 boolean numToPrepareIncludeLevel, boolean numToPrepareIncludeHalfLevel,
                                 int numToPrepareMiscModifier) {
        this.requirePreparation = requirePreparation;
        this.numToPrepareAbilityModifier = numToPrepareAbilityModifier;
        this.numToPrepareIncludeLevel = numToPrepareIncludeLevel;
        this.numToPrepareIncludeHalfLevel = numToPrepareIncludeHalfLevel;
        this.numToPrepareMiscModifier = numToPrepareMiscModifier;
    }

    public boolean isRequirePreparation() {
        return requirePreparation;
    }

    public void setRequirePreparation(boolean requirePreparation) {
        this.requirePreparation = requirePreparation;
    }

    public Ability getNumToPrepareAbilityModifier() {
        return numToPrepareAbilityModifier;
    }

    public void setNumToPrepareAbilityModifier(Ability numToPrepareAbilityModifier) {
        this.numToPrepareAbilityModifier = numToPrepareAbilityModifier;
    }

    public boolean isNumToPrepareIncludeLevel() {
        return numToPrepareIncludeLevel;
    }

    public void setNumToPrepareIncludeLevel(boolean numToPrepareIncludeLevel) {
        this.numToPrepareIncludeLevel = numToPrepareIncludeLevel;
    }

    public boolean isNumToPrepareIncludeHalfLevel() {
        return numToPrepareIncludeHalfLevel;
    }

    public void setNumToPrepareIncludeHalfLevel(boolean numToPrepareIncludeHalfLevel) {
        this.numToPrepareIncludeHalfLevel = numToPrepareIncludeHalfLevel;
    }

    public int getNumToPrepareMiscModifier() {
        return numToPrepareMiscModifier;
    }

    public void setNumToPrepareMiscModifier(int numToPrepareMiscModifier) {
        this.numToPrepareMiscModifier = numToPrepareMiscModifier;
    }
}
