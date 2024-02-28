package com.herd.squire.models.rolls;

import java.util.HashMap;
import java.util.Map;

public enum RollType {
    STANDARD(1),
    ATTACK(2),
    DAMAGE(3),
    SAVE(4),
    HEAL(5);

    private final int value;
    private static final Map<Integer, RollType> map = new HashMap<>();

    RollType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (RollType rollType : RollType.values()) {
            map.put(rollType.value, rollType);
        }
    }

    public static RollType valueOf(int rollType) {
        return map.get(rollType);
    }
}
