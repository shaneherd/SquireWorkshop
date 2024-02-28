package com.herd.squire.models.campaigns;

import java.util.HashMap;
import java.util.Map;

public enum ExperienceType {
    EXP(1),
    MILESTONE(2);

    private final int value;
    private static final Map<Integer, ExperienceType> map = new HashMap<>();

    ExperienceType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (ExperienceType experienceType : ExperienceType.values()) {
            map.put(experienceType.value, experienceType);
        }
    }

    public static ExperienceType valueOf(int experienceType) {
        return map.get(experienceType);
    }
}
