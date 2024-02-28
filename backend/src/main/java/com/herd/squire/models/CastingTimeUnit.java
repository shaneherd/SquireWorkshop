package com.herd.squire.models;

import java.util.HashMap;
import java.util.Map;

public enum CastingTimeUnit {
    ACTION(1),
    BONUS_ACTION(2),
    REACTION(3),
    SECOND(4),
    MINUTE(5),
    HOUR(6);

    private final int value;
    private static final Map<Integer, CastingTimeUnit> map = new HashMap<>();

    CastingTimeUnit(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CastingTimeUnit castingTimeUnit : CastingTimeUnit.values()) {
            map.put(castingTimeUnit.value, castingTimeUnit);
        }
    }

    public static CastingTimeUnit valueOf(int castingTimeUnit) {
        return map.get(castingTimeUnit);
    }
}
