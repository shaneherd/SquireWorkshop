package com.herd.squire.models.monsters;

import java.util.HashMap;
import java.util.Map;

public enum MonsterPowerType {
    ACTION(1),
    FEATURE(2);

    private final int value;
    private static final Map<Integer, MonsterPowerType> map = new HashMap<>();

    MonsterPowerType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (MonsterPowerType monsterPowerType : MonsterPowerType.values()) {
            map.put(monsterPowerType.value, monsterPowerType);
        }
    }

    public static MonsterPowerType valueOf(int monsterPowerType) {
        return map.get(monsterPowerType);
    }
}
