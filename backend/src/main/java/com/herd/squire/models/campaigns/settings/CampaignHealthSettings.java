package com.herd.squire.models.campaigns.settings;

import com.herd.squire.models.creatures.characters.HealthCalculationType;

public class CampaignHealthSettings {
    private HealthCalculationType healthCalculationType;
    private boolean grouped;
    private boolean killMonsters;

    public CampaignHealthSettings() {
        this.healthCalculationType = HealthCalculationType.AVERAGE;
        this.grouped = true;
        this.killMonsters = true;
    }

    public CampaignHealthSettings(HealthCalculationType healthCalculationType, boolean grouped, boolean killMonsters) {
        this.healthCalculationType = healthCalculationType;
        this.grouped = grouped;
        this.killMonsters = killMonsters;
    }

    public HealthCalculationType getHealthCalculationType() {
        return healthCalculationType;
    }

    public void setHealthCalculationType(HealthCalculationType healthCalculationType) {
        this.healthCalculationType = healthCalculationType;
    }

    public boolean isGrouped() {
        return grouped;
    }

    public void setGrouped(boolean grouped) {
        this.grouped = grouped;
    }

    public boolean isKillMonsters() {
        return killMonsters;
    }

    public void setKillMonsters(boolean killMonsters) {
        this.killMonsters = killMonsters;
    }
}
