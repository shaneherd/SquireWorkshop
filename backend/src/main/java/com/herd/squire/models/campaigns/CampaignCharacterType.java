package com.herd.squire.models.campaigns;

import java.util.HashMap;
import java.util.Map;

public enum CampaignCharacterType {
    CHARACTER(1),
    NPC(2),
    OTHER(3);

    private final int value;
    private static final Map<Integer, CampaignCharacterType> map = new HashMap<>();

    CampaignCharacterType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CampaignCharacterType campaignCharacterType : CampaignCharacterType.values()) {
            map.put(campaignCharacterType.value, campaignCharacterType);
        }
    }

    public static CampaignCharacterType valueOf(int campaignCharacterType) {
        return map.get(campaignCharacterType);
    }
}
