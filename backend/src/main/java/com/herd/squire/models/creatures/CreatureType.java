package com.herd.squire.models.creatures;

import java.util.HashMap;
import java.util.Map;

public enum CreatureType {
    CHARACTER(1),
    MONSTER(2),
    QUICK_CHARACTER(3),
    NPC(4),
    COMPANION(5);

    private final int value;
    private static final Map<Integer, CreatureType> map = new HashMap<>();

    CreatureType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CreatureType creatureType : CreatureType.values()) {
            map.put(creatureType.value, creatureType);
        }
    }

    public static CreatureType valueOf(int creatureType) {
        return map.get(creatureType);
    }
}
