package com.herd.squire.models.creatures.characters.settings;

public class CharacterMiscSettings {
    private int maxColumns;
    private boolean showHealthProgressBar;
    private boolean showLevelProgressBar;
    private boolean showCarryingProgressBar;

    public CharacterMiscSettings() {
        this.maxColumns = 10;
        this.showHealthProgressBar = true;
        this.showLevelProgressBar = true;
        this.showCarryingProgressBar = true;
    }

    public CharacterMiscSettings(int maxColumns, boolean showHealthProgressBar, boolean showLevelProgressBar, boolean showCarryingProgressBar) {
        this.maxColumns = maxColumns;
        this.showHealthProgressBar = showHealthProgressBar;
        this.showLevelProgressBar = showLevelProgressBar;
        this.showCarryingProgressBar = showCarryingProgressBar;
    }

    public int getMaxColumns() {
        return maxColumns;
    }

    public void setMaxColumns(int maxColumns) {
        this.maxColumns = maxColumns;
    }

    public boolean isShowHealthProgressBar() {
        return showHealthProgressBar;
    }

    public void setShowHealthProgressBar(boolean showHealthProgressBar) {
        this.showHealthProgressBar = showHealthProgressBar;
    }

    public boolean isShowLevelProgressBar() {
        return showLevelProgressBar;
    }

    public void setShowLevelProgressBar(boolean showLevelProgressBar) {
        this.showLevelProgressBar = showLevelProgressBar;
    }

    public boolean isShowCarryingProgressBar() {
        return showCarryingProgressBar;
    }

    public void setShowCarryingProgressBar(boolean showCarryingProgressBar) {
        this.showCarryingProgressBar = showCarryingProgressBar;
    }
}
