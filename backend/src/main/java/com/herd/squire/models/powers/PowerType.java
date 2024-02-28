package com.herd.squire.models.powers;

import java.util.HashMap;
import java.util.Map;

public enum PowerType {
    SPELL(1),
    FEATURE(2),
    QUICK_ATTACK(3),
    MONSTER_ACTION(4),
    MONSTER_FEATURE(5);

    private final int value;
    private static final Map<Integer, PowerType> map = new HashMap<>();

    PowerType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (PowerType powerType : PowerType.values()) {
            map.put(powerType.value, powerType);
        }
    }

    public static PowerType valueOf(int powerType) {
        return map.get(powerType);
    }
}
