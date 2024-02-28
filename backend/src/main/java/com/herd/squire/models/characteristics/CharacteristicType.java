package com.herd.squire.models.characteristics;

import java.util.HashMap;
import java.util.Map;

public enum CharacteristicType {
    NONE(0),
    CLASS(1),
    RACE(2),
    BACKGROUND(3),
    FEAT(-1);

    private final int value;
    private static final Map<Integer, CharacteristicType> map = new HashMap<>();

    CharacteristicType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CharacteristicType characteristicType : CharacteristicType.values()) {
            map.put(characteristicType.value, characteristicType);
        }
    }

    public static CharacteristicType valueOf(int characteristicType) {
        if (characteristicType == 0) {
            characteristicType = -1;
        }
        return map.get(characteristicType);
    }
}
