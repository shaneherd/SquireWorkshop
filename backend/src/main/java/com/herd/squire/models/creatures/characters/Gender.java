package com.herd.squire.models.creatures.characters;

import java.util.HashMap;
import java.util.Map;

public enum Gender {
    NEUTRAL(1),
    MALE(2),
    FEMALE(3);

    private final int value;
    private static final Map<Integer, Gender> map = new HashMap<>();

    Gender(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (Gender gender : Gender.values()) {
            map.put(gender.value, gender);
        }
    }

    public static Gender valueOf(int gender) {
        return map.get(gender);
    }
}
