package com.herd.squire.models;

import java.util.HashMap;
import java.util.Map;

public enum LimitedUseType {
    QUANTITY(1),
    DICE(2),
    LEVEL(3),
    RECHARGE(4);

    private final int value;
    private static final Map<Integer, LimitedUseType> map = new HashMap<>();

    LimitedUseType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (LimitedUseType limitedUseType : LimitedUseType.values()) {
            map.put(limitedUseType.value, limitedUseType);
        }
    }

    public static LimitedUseType valueOf(int limitedUseType) {
        return map.get(limitedUseType);
    }
}
