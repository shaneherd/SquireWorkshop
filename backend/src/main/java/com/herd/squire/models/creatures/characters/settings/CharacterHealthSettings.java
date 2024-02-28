package com.herd.squire.models.creatures.characters.settings;

public class CharacterHealthSettings {
    private boolean showHitDice;
    private boolean highlightValues;
    private boolean flashLCD;
    private boolean autoRollConcentrationChecks;
    private boolean postponeConcentrationChecks;
    private boolean removeProneOnRevive;
    private boolean dropItemsWhenDying;

    public CharacterHealthSettings() {
        showHitDice = false;
        highlightValues = true;
        flashLCD = true;
        autoRollConcentrationChecks = true;
        postponeConcentrationChecks = false;
        removeProneOnRevive = false;
        dropItemsWhenDying = true;
    }

    public CharacterHealthSettings(boolean showHitDice, boolean highlightValues,
                                   boolean flashLCD, boolean autoRollConcentrationChecks,
                                   boolean postponeConcentrationChecks, boolean removeProneOnRevive, boolean dropItemsWhenDying) {
        this.showHitDice = showHitDice;
        this.highlightValues = highlightValues;
        this.flashLCD = flashLCD;
        this.autoRollConcentrationChecks = autoRollConcentrationChecks;
        this.postponeConcentrationChecks = postponeConcentrationChecks;
        this.removeProneOnRevive = removeProneOnRevive;
        this.dropItemsWhenDying = dropItemsWhenDying;
    }

    public boolean isShowHitDice() {
        return showHitDice;
    }

    public void setShowHitDice(boolean showHitDice) {
        this.showHitDice = showHitDice;
    }

    public boolean isHighlightValues() {
        return highlightValues;
    }

    public void setHighlightValues(boolean highlightValues) {
        this.highlightValues = highlightValues;
    }

    public boolean isFlashLCD() {
        return flashLCD;
    }

    public void setFlashLCD(boolean flashLCD) {
        this.flashLCD = flashLCD;
    }

    public boolean isAutoRollConcentrationChecks() {
        return autoRollConcentrationChecks;
    }

    public void setAutoRollConcentrationChecks(boolean autoRollConcentrationChecks) {
        this.autoRollConcentrationChecks = autoRollConcentrationChecks;
    }

    public boolean isPostponeConcentrationChecks() {
        return postponeConcentrationChecks;
    }

    public void setPostponeConcentrationChecks(boolean postponeConcentrationChecks) {
        this.postponeConcentrationChecks = postponeConcentrationChecks;
    }

    public boolean isRemoveProneOnRevive() {
        return removeProneOnRevive;
    }

    public void setRemoveProneOnRevive(boolean removeProneOnRevive) {
        this.removeProneOnRevive = removeProneOnRevive;
    }

    public boolean isDropItemsWhenDying() {
        return dropItemsWhenDying;
    }

    public void setDropItemsWhenDying(boolean dropItemsWhenDying) {
        this.dropItemsWhenDying = dropItemsWhenDying;
    }
}
