package com.herd.squire.models.campaigns.settings;

import java.util.HashMap;
import java.util.Map;

public enum CampaignSetting {
    HEALTH_CALCULATION_TYPE(1),
    GROUPED_HP(2),
    KILL_MONSTERS(3),
    HIDE_KILLED(4),
    GROUPED_INITIATIVE(5),
    NATURAL_20_GOES_FIRST(6),
    EXPERIENCE_TYPE(7),
    USE_ADJUSTED(8),
    SPLIT_EVENLY(9),
    GROUP_CHECK_TYPE(10),
    CRITICAL_DOUBLES(11);

    private final int value;
    private static final Map<Integer, CampaignSetting> map = new HashMap<>();

    CampaignSetting(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CampaignSetting CampaignSetting : CampaignSetting.values()) {
            map.put(CampaignSetting.value, CampaignSetting);
        }
    }

    public static CampaignSetting valueOf(int CampaignSetting) {
        return map.get(CampaignSetting);
    }
}
