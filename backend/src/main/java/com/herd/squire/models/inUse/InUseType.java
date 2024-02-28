package com.herd.squire.models.inUse;

import java.util.HashMap;
import java.util.Map;

public enum InUseType {
    CREATURE(1),
    CHARACTERISTIC(2),
    POWER(3),
    ITEM(4),
    ATTRIBUTE(5),
    MONSTER(6);

    private final int value;
    private static final Map<Integer, InUseType> map = new HashMap<>();

    InUseType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (InUseType inUseType : InUseType.values()) {
            map.put(inUseType.value, inUseType);
        }
    }

    public static InUseType valueOf(int inUseType) {
        return map.get(inUseType);
    }
}
