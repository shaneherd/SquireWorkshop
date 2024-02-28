package com.herd.squire.models.campaigns.settings;

public class CampaignInitiativeSettings {
    private boolean grouped;
    private boolean natural20First;
    private boolean hideKilled;

    public CampaignInitiativeSettings() {
        this.grouped = true;
        this.natural20First = true;
        this.hideKilled = true;
    }

    public CampaignInitiativeSettings(boolean grouped, boolean natural20First, boolean hideKilled) {
        this.grouped = grouped;
        this.natural20First = natural20First;
        this.hideKilled = hideKilled;
    }

    public boolean isGrouped() {
        return grouped;
    }

    public void setGrouped(boolean grouped) {
        this.grouped = grouped;
    }

    public boolean isNatural20First() {
        return natural20First;
    }

    public void setNatural20First(boolean natural20First) {
        this.natural20First = natural20First;
    }

    public boolean isHideKilled() {
        return hideKilled;
    }

    public void setHideKilled(boolean hideKilled) {
        this.hideKilled = hideKilled;
    }
}
