package com.herd.squire.models;

import java.util.HashMap;
import java.util.Map;

public enum DiceSize {
    ONE(1, 1),
    TWO(2, 2),
    THREE(3, 3),
    FOUR(4, 4),
    SIX(5, 6),
    EIGHT(6, 8),
    TEN(7, 10),
    TWELVE(8, 12),
    TWENTY(9, 20),
    HUNDRED(10, 100);

    private final int value;
    private final int numberValue;
    private static final Map<Integer, DiceSize> map = new HashMap<>();

    DiceSize(int value, int numberValue) {
        this.value = value;
        this.numberValue = numberValue;
    }

    public int getValue() {
        return value;
    }

    public int getNumberValue() {
        return numberValue;
    }

    static {
        for (DiceSize diceSize : DiceSize.values()) {
            map.put(diceSize.value, diceSize);
        }
    }

    public static DiceSize valueOf(int diceSize) {
        return map.get(diceSize);
    }
}
