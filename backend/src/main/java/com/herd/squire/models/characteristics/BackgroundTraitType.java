package com.herd.squire.models.characteristics;

import java.util.HashMap;
import java.util.Map;

public enum BackgroundTraitType {
    NONE(0),
    VARIATION(1),
    PERSONALITY(2),
    IDEAL(3),
    BOND(4),
    FLAW(5);

    private final int value;
    private static final Map<Integer, BackgroundTraitType> map = new HashMap<>();

    BackgroundTraitType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (BackgroundTraitType backgroundTraitType : BackgroundTraitType.values()) {
            map.put(backgroundTraitType.value, backgroundTraitType);
        }
    }

    public static BackgroundTraitType valueOf(int backgroundTraitType) {
        return map.get(backgroundTraitType);
    }
}
