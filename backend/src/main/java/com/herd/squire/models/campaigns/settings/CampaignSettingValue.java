package com.herd.squire.models.campaigns.settings;

public class CampaignSettingValue {
    private CampaignSettingCategory category;
    private CampaignSetting setting;
    private int value;

    public CampaignSettingValue() {}

    public CampaignSettingValue(CampaignSettingCategory category, CampaignSetting setting, int value) {
        this.category = category;
        this.setting = setting;
        this.value = value;
    }

    public CampaignSettingValue(CampaignSettingCategory category, CampaignSetting setting, boolean value) {
        this.category = category;
        this.setting = setting;
        this.value = value ? 1 : 0;
    }

    public CampaignSettingCategory getCategory() {
        return category;
    }

    public void setCategory(CampaignSettingCategory category) {
        this.category = category;
    }

    public CampaignSetting getSetting() {
        return setting;
    }

    public void setSetting(CampaignSetting setting) {
        this.setting = setting;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
