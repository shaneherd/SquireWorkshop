package com.herd.squire.models;

import java.util.HashMap;
import java.util.Map;

public enum Action {
    STANDARD(1),
    BONUS(2),
    REACTION(3),
    FREE(4),
    MOVE(5),
    LEGENDARY(6),
    LAIR(7);

    private final int value;
    private static final Map<Integer, Action> map = new HashMap<>();

    Action(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (Action action : Action.values()) {
            map.put(action.value, action);
        }
    }

    public static Action valueOf(int action) {
        return map.get(action);
    }
}
