package com.herd.squire.models.creatures;

import java.util.HashMap;
import java.util.Map;

public enum CreatureState {
    STABLE(1),
    UNSTABLE(2),
    CONSCIOUS(3),
    DEAD(4);

    private final int value;
    private static final Map<Integer, CreatureState> map = new HashMap<>();

    CreatureState(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CreatureState creatureState : CreatureState.values()) {
            map.put(creatureState.value, creatureState);
        }
    }

    public static CreatureState valueOf(int creatureState) {
        return map.get(creatureState);
    }
}
