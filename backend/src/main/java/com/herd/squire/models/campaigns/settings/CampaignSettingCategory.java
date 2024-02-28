package com.herd.squire.models.campaigns.settings;

import java.util.HashMap;
import java.util.Map;

public enum CampaignSettingCategory {
    HEALTH(1),
    INITIATIVE(2),
    EXPERIENCE(3),
    SURPRISE(4);

    private final int value;
    private static final Map<Integer, CampaignSettingCategory> map = new HashMap<>();

    CampaignSettingCategory(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CampaignSettingCategory CampaignSettingCategory : CampaignSettingCategory.values()) {
            map.put(CampaignSettingCategory.value, CampaignSettingCategory);
        }
    }

    public static CampaignSettingCategory valueOf(int CampaignSettingCategory) {
        return map.get(CampaignSettingCategory);
    }
}
