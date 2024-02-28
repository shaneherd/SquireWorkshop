package com.herd.squire.models.powers;

import java.util.HashMap;
import java.util.Map;

public enum RangeType {
    SELF(1),
    TOUCH(2),
    SIGHT(3),
    UNLIMITED(4),
    OTHER(5);

    private final int value;
    private static final Map<Integer, RangeType> map = new HashMap<>();

    RangeType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (RangeType rangeType : RangeType.values()) {
            map.put(rangeType.value, rangeType);
        }
    }

    public static RangeType valueOf(int rangeType) {
        return map.get(rangeType);
    }
}
