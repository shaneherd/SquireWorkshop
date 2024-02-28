package com.herd.squire.models;

import java.util.HashMap;
import java.util.Map;

public enum SpeedType {
    WALK(1),
    CRAWL(2),
    CLIMB(3),
    SWIM(4),
    FLY(5),
    BURROW(6);

    private final int value;
    private static final Map<Integer, SpeedType> map = new HashMap<>();

    SpeedType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (SpeedType speedType : SpeedType.values()) {
            map.put(speedType.value, speedType);
        }
    }

    public static SpeedType valueOf(int speedType) {
        return map.get(speedType);
    }
}
