package com.herd.squire.models.items.magical_item;


import java.util.HashMap;
import java.util.Map;

public enum Rarity {
    COMMON(1),
    UNCOMMON(2),
    RARE(3),
    VERY_RARE(4),
    LEGENDARY(5);

    private final int value;
    private static final Map<Integer, Rarity> map = new HashMap<>();

    Rarity(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (Rarity rarity : Rarity.values()) {
            map.put(rarity.value, rarity);
        }
    }

    public static Rarity valueOf(int rarity) {
        return map.get(rarity);
    }
}
