package com.herd.squire.models.campaigns.settings;

import com.herd.squire.models.campaigns.ExperienceType;

public class CampaignExperienceSettings {
    private ExperienceType experienceType;
    private boolean useAdjusted;
    private boolean splitEvenly;

    public CampaignExperienceSettings() {
        this.experienceType = ExperienceType.EXP;
        this.useAdjusted = false;
        this.splitEvenly = true;
    }

    public CampaignExperienceSettings(ExperienceType experienceType, boolean useAdjusted, boolean splitEvenly) {
        this.experienceType = experienceType;
        this.useAdjusted = useAdjusted;
        this.splitEvenly = splitEvenly;
    }

    public ExperienceType getExperienceType() {
        return experienceType;
    }

    public void setExperienceType(ExperienceType experienceType) {
        this.experienceType = experienceType;
    }

    public boolean isUseAdjusted() {
        return useAdjusted;
    }

    public void setUseAdjusted(boolean useAdjusted) {
        this.useAdjusted = useAdjusted;
    }

    public boolean isSplitEvenly() {
        return splitEvenly;
    }

    public void setSplitEvenly(boolean splitEvenly) {
        this.splitEvenly = splitEvenly;
    }
}
