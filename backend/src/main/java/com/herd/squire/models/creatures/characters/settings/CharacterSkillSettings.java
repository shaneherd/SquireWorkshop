package com.herd.squire.models.creatures.characters.settings;

public class CharacterSkillSettings {
    private boolean displayPassive;

    public CharacterSkillSettings() {
        displayPassive = false;
    }

    public CharacterSkillSettings(boolean displayPassive) {
        this.displayPassive = displayPassive;
    }

    public boolean isDisplayPassive() {
        return displayPassive;
    }

    public void setDisplayPassive(boolean displayPassive) {
        this.displayPassive = displayPassive;
    }
}
