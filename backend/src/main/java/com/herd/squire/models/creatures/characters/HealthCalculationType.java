package com.herd.squire.models.creatures.characters;

import java.util.HashMap;
import java.util.Map;

public enum HealthCalculationType {
    MAX(1),
    AVERAGE(2),
    ROLL(3);

    private final int value;
    private static final Map<Integer, HealthCalculationType> map = new HashMap<>();

    HealthCalculationType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (HealthCalculationType healthCalculationType : HealthCalculationType.values()) {
            map.put(healthCalculationType.value, healthCalculationType);
        }
    }

    public static HealthCalculationType valueOf(int healthCalculationType) {
        return map.get(healthCalculationType);
    }
}
