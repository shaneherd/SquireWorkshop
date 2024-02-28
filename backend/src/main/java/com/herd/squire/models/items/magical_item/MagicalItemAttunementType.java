package com.herd.squire.models.items.magical_item;

import java.util.HashMap;
import java.util.Map;

public enum MagicalItemAttunementType {
    ANY(1),
    CASTER(2),
    CLASS(3),
    ALIGNMENT(4),
    RACE(5);

    private final int value;
    private static final Map<Integer, MagicalItemAttunementType> map = new HashMap<>();

    MagicalItemAttunementType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (MagicalItemAttunementType MagicalItemAttunementType : MagicalItemAttunementType.values()) {
            map.put(MagicalItemAttunementType.value, MagicalItemAttunementType);
        }
    }

    public static MagicalItemAttunementType valueOf(int MagicalItemAttunementType) {
        return map.get(MagicalItemAttunementType);
    }
}
