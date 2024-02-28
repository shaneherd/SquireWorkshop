package com.herd.squire.models.proficiency;

public class Proficiency {
    private ProficiencyListObject attribute;
    private boolean proficient;
    private int miscModifier;
    private boolean advantage;
    private boolean advantageDisabled;
    private String advantageTooltip;
    private boolean disadvantage;
    private boolean disadvantageDisabled;
    private String disadvantageTooltip;
    private boolean doubleProf;
    private boolean halfProf;
    private boolean roundUp;

    public Proficiency() {}

    public Proficiency(ProficiencyListObject attribute) {
        this.attribute = attribute;
    }

    public Proficiency(boolean proficient) {
        this.proficient = proficient;
    }

    public Proficiency(ProficiencyListObject attribute, boolean proficient, int miscModifier, boolean advantage, boolean disadvantage, boolean doubleProf, boolean halfProf, boolean roundUp) {
        this.attribute = attribute;
        this.proficient = proficient;
        this.miscModifier = miscModifier;
        this.advantage = advantage;
        this.disadvantage = disadvantage;
        this.doubleProf = doubleProf;
        this.halfProf = halfProf;
        this.roundUp = roundUp;
    }

    public ProficiencyListObject getAttribute() {
        return attribute;
    }

    public void setAttribute(ProficiencyListObject attribute) {
        this.attribute = attribute;
    }

    public boolean isProficient() {
        return proficient;
    }

    public void setProficient(boolean proficient) {
        this.proficient = proficient;
    }

    public int getMiscModifier() {
        return miscModifier;
    }

    public void setMiscModifier(int miscModifier) {
        this.miscModifier = miscModifier;
    }

    public boolean isAdvantage() {
        return advantage;
    }

    public void setAdvantage(boolean advantage) {
        this.advantage = advantage;
    }

    public boolean isDisadvantage() {
        return disadvantage;
    }

    public void setDisadvantage(boolean disadvantage) {
        this.disadvantage = disadvantage;
    }

    public boolean isDoubleProf() {
        return doubleProf;
    }

    public void setDoubleProf(boolean doubleProf) {
        this.doubleProf = doubleProf;
    }

    public boolean isHalfProf() {
        return halfProf;
    }

    public void setHalfProf(boolean halfProf) {
        this.halfProf = halfProf;
    }

    public boolean isRoundUp() {
        return roundUp;
    }

    public void setRoundUp(boolean roundUp) {
        this.roundUp = roundUp;
    }

    /********************* NOT USED *******************/

    public boolean isAdvantageDisabled() {
        return advantageDisabled;
    }

    public void setAdvantageDisabled(boolean advantageDisabled) {
        this.advantageDisabled = advantageDisabled;
    }

    public String getAdvantageTooltip() {
        return advantageTooltip;
    }

    public void setAdvantageTooltip(String advantageTooltip) {
        this.advantageTooltip = advantageTooltip;
    }

    public boolean isDisadvantageDisabled() {
        return disadvantageDisabled;
    }

    public void setDisadvantageDisabled(boolean disadvantageDisabled) {
        this.disadvantageDisabled = disadvantageDisabled;
    }

    public String getDisadvantageTooltip() {
        return disadvantageTooltip;
    }

    public void setDisadvantageTooltip(String disadvantageTooltip) {
        this.disadvantageTooltip = disadvantageTooltip;
    }
}
