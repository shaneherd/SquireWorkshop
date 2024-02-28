package com.herd.squire.models.creatures.characters.settings;

public class CharacterSpellcastingSettings {
    private boolean displayClassSpellcasting;
    private boolean displayRaceSpellcasting;
    private boolean displayBackgroundSpellcasting;
    private boolean displayOtherSpellcasting;
    private boolean displayTags;
    private boolean highlightActive;

    public CharacterSpellcastingSettings() {
        displayClassSpellcasting = true;
        displayRaceSpellcasting = false;
        displayBackgroundSpellcasting = false;
        displayOtherSpellcasting = false;
        displayTags = true;
        highlightActive = true;
    }

    public CharacterSpellcastingSettings(boolean displayClassSpellcasting, boolean displayRaceSpellcasting,
                                         boolean displayBackgroundSpellcasting, boolean displayOtherSpellcasting,
                                         boolean displayTags, boolean highlightActive) {
        this.displayClassSpellcasting = displayClassSpellcasting;
        this.displayRaceSpellcasting = displayRaceSpellcasting;
        this.displayBackgroundSpellcasting = displayBackgroundSpellcasting;
        this.displayOtherSpellcasting = displayOtherSpellcasting;
        this.displayTags = displayTags;
        this.highlightActive = highlightActive;
    }

    public boolean isDisplayClassSpellcasting() {
        return displayClassSpellcasting;
    }

    public void setDisplayClassSpellcasting(boolean displayClassSpellcasting) {
        this.displayClassSpellcasting = displayClassSpellcasting;
    }

    public boolean isDisplayRaceSpellcasting() {
        return displayRaceSpellcasting;
    }

    public void setDisplayRaceSpellcasting(boolean displayRaceSpellcasting) {
        this.displayRaceSpellcasting = displayRaceSpellcasting;
    }

    public boolean isDisplayBackgroundSpellcasting() {
        return displayBackgroundSpellcasting;
    }

    public void setDisplayBackgroundSpellcasting(boolean displayBackgroundSpellcasting) {
        this.displayBackgroundSpellcasting = displayBackgroundSpellcasting;
    }

    public boolean isDisplayOtherSpellcasting() {
        return displayOtherSpellcasting;
    }

    public void setDisplayOtherSpellcasting(boolean displayOtherSpellcasting) {
        this.displayOtherSpellcasting = displayOtherSpellcasting;
    }

    public boolean isDisplayTags() {
        return displayTags;
    }

    public void setDisplayTags(boolean displayTags) {
        this.displayTags = displayTags;
    }

    public boolean isHighlightActive() {
        return highlightActive;
    }

    public void setHighlightActive(boolean highlightActive) {
        this.highlightActive = highlightActive;
    }
}
