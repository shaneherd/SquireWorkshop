package com.herd.squire.models.creatures.companions;

import java.util.HashMap;
import java.util.Map;

public enum CompanionType {
    BEAST(1),
    WILD_SHAPE(2),
    SUMMON(3);

    private final int value;
    private static final Map<Integer, CompanionType> map = new HashMap<>();

    CompanionType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CompanionType CompanionType : CompanionType.values()) {
            map.put(CompanionType.value, CompanionType);
        }
    }

    public static CompanionType valueOf(int CompanionType) {
        return map.get(CompanionType);
    }
}
