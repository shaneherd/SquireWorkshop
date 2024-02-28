package com.herd.squire.models.creatures;

import java.util.HashMap;
import java.util.Map;

public enum CreatureItemState {
    CARRIED(1),
    DROPPED(2),
    EQUIPPED(3),
    EXPENDED(4);

    private final int value;
    private static final Map<Integer, CreatureItemState> map = new HashMap<>();

    CreatureItemState(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CreatureItemState creatureItemState : CreatureItemState.values()) {
            map.put(creatureItemState.value, creatureItemState);
        }
    }

    public static CreatureItemState valueOf(int creatureItemState) {
        return map.get(creatureItemState);
    }
}
