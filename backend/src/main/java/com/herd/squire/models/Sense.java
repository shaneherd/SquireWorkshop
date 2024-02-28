package com.herd.squire.models;

import java.util.HashMap;
import java.util.Map;

public enum Sense {
    DARKVISION(1),
    BLINDSIGHT(2),
    TELEPATHY(3),
    TREMORSENSE(4),
    TRUESIGHT(5);

    private final int value;
    private static final Map<Integer, Sense> map = new HashMap<>();

    Sense(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (Sense sense : Sense.values()) {
            map.put(sense.value, sense);
        }
    }

    public static Sense valueOf(int sense) {
        return map.get(sense);
    }
}
