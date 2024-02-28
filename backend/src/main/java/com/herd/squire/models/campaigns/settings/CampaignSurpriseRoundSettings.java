package com.herd.squire.models.campaigns.settings;

import com.herd.squire.models.GroupCheckType;

public class CampaignSurpriseRoundSettings {
    private GroupCheckType groupCheckType;
    private boolean criticalDoubles;

    public CampaignSurpriseRoundSettings() {
        this.groupCheckType = GroupCheckType.GROUP;
        this.criticalDoubles = true;
    }

    public CampaignSurpriseRoundSettings(GroupCheckType groupCheckType, boolean criticalDoubles) {
        this.groupCheckType = groupCheckType;
        this.criticalDoubles = criticalDoubles;
    }

    public GroupCheckType getGroupCheckType() {
        return groupCheckType;
    }

    public void setGroupCheckType(GroupCheckType groupCheckType) {
        this.groupCheckType = groupCheckType;
    }

    public boolean isCriticalDoubles() {
        return criticalDoubles;
    }

    public void setCriticalDoubles(boolean criticalDoubles) {
        this.criticalDoubles = criticalDoubles;
    }
}
