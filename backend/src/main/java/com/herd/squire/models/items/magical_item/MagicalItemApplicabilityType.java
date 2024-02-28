package com.herd.squire.models.items.magical_item;

import java.util.HashMap;
import java.util.Map;

public enum MagicalItemApplicabilityType {
    ITEM(1),
    FILTER(2),
    SPELL(3);

    private final int value;
    private static final Map<Integer, MagicalItemApplicabilityType> map = new HashMap<>();

    MagicalItemApplicabilityType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (MagicalItemApplicabilityType magicalItemApplicabilityType : MagicalItemApplicabilityType.values()) {
            map.put(magicalItemApplicabilityType.value, magicalItemApplicabilityType);
        }
    }

    public static MagicalItemApplicabilityType valueOf(int magicalItemApplicabilityType) {
        return map.get(magicalItemApplicabilityType);
    }
}
