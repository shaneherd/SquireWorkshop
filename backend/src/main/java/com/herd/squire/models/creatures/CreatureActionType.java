package com.herd.squire.models.creatures;

import java.util.HashMap;
import java.util.Map;

public enum CreatureActionType {
    SPELL(1),
    FEATURE(2),
    ITEM(3),
    CHAINED(4),
    OTHER(5);

    private final int value;
    private static final Map<Integer, CreatureActionType> map = new HashMap<>();

    CreatureActionType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CreatureActionType creatureActionType : CreatureActionType.values()) {
            map.put(creatureActionType.value, creatureActionType);
        }
    }

    public static CreatureActionType valueOf(int creatureActionType) {
        return map.get(creatureActionType);
    }
}
