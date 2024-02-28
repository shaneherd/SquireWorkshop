package com.herd.squire.models.creatures.characters.settings;

public class CharacterValidationSettings {
    private boolean allowFeatSelection;
    private boolean asiFeatOneOnly;
    private boolean autoIgnoreUnselectedFeatures;
    private boolean autoIgnoreUnselectedSpells;
    private boolean autoIgnoreUnselectedAsi;

    public CharacterValidationSettings() {
        allowFeatSelection = true;
        asiFeatOneOnly = true;
        autoIgnoreUnselectedFeatures = false;
        autoIgnoreUnselectedSpells = false;
        autoIgnoreUnselectedAsi = false;
    }

    public CharacterValidationSettings(boolean allowFeatSelection, boolean asiFeatOneOnly,
                                       boolean autoIgnoreUnselectedFeatures, boolean autoIgnoreUnselectedSpells,
                                       boolean autoIgnoreUnselectedAsi) {
        this.allowFeatSelection = allowFeatSelection;
        this.asiFeatOneOnly = asiFeatOneOnly;
        this.autoIgnoreUnselectedFeatures = autoIgnoreUnselectedFeatures;
        this.autoIgnoreUnselectedSpells = autoIgnoreUnselectedSpells;
        this.autoIgnoreUnselectedAsi = autoIgnoreUnselectedAsi;
    }

    public boolean isAllowFeatSelection() {
        return allowFeatSelection;
    }

    public void setAllowFeatSelection(boolean allowFeatSelection) {
        this.allowFeatSelection = allowFeatSelection;
    }

    public boolean isAsiFeatOneOnly() {
        return asiFeatOneOnly;
    }

    public void setAsiFeatOneOnly(boolean asiFeatOneOnly) {
        this.asiFeatOneOnly = asiFeatOneOnly;
    }

    public boolean isAutoIgnoreUnselectedFeatures() {
        return autoIgnoreUnselectedFeatures;
    }

    public void setAutoIgnoreUnselectedFeatures(boolean autoIgnoreUnselectedFeatures) {
        this.autoIgnoreUnselectedFeatures = autoIgnoreUnselectedFeatures;
    }

    public boolean isAutoIgnoreUnselectedSpells() {
        return autoIgnoreUnselectedSpells;
    }

    public void setAutoIgnoreUnselectedSpells(boolean autoIgnoreUnselectedSpells) {
        this.autoIgnoreUnselectedSpells = autoIgnoreUnselectedSpells;
    }

    public boolean isAutoIgnoreUnselectedAsi() {
        return autoIgnoreUnselectedAsi;
    }

    public void setAutoIgnoreUnselectedAsi(boolean autoIgnoreUnselectedAsi) {
        this.autoIgnoreUnselectedAsi = autoIgnoreUnselectedAsi;
    }
}
