package com.herd.squire.models.creatures.characters.settings;

public class CharacterQuickActionSettings {
    private boolean hideUnpreparedSpells;

    public CharacterQuickActionSettings() {
        hideUnpreparedSpells = false;
    }

    public CharacterQuickActionSettings(boolean hideUnpreparedSpells) {
        this.hideUnpreparedSpells = hideUnpreparedSpells;
    }

    public boolean isHideUnpreparedSpells() {
        return hideUnpreparedSpells;
    }

    public void setHideUnpreparedSpells(boolean hideUnpreparedSpells) {
        this.hideUnpreparedSpells = hideUnpreparedSpells;
    }
}
