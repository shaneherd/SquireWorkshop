package com.herd.squire.models.powers;

import java.util.HashMap;
import java.util.Map;

public enum RangeUnit {
    FEET(1),
    MILE(2);

    private final int value;
    private static final Map<Integer, RangeUnit> map = new HashMap<>();

    RangeUnit(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (RangeUnit rangeUnit : RangeUnit.values()) {
            map.put(rangeUnit.value, rangeUnit);
        }
    }

    public static RangeUnit valueOf(int rangeUnit) {
        return map.get(rangeUnit);
    }
}
