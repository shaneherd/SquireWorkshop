package com.herd.squire.models.creatures.characters.settings;

public class CharacterFeatureSettings {
    private boolean displayTags;
    private boolean highlightActive;
    private boolean highlightNonActive;

    public CharacterFeatureSettings() {
        displayTags = true;
        highlightActive = true;
        highlightNonActive = true;
    }

    public CharacterFeatureSettings(boolean displayTags, boolean highlightActive, boolean highlightNonActive) {
        this.displayTags = displayTags;
        this.highlightActive = highlightActive;
        this.highlightNonActive = highlightNonActive;
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

    public boolean isHighlightNonActive() {
        return highlightNonActive;
    }

    public void setHighlightNonActive(boolean highlightNonActive) {
        this.highlightNonActive = highlightNonActive;
    }
}
