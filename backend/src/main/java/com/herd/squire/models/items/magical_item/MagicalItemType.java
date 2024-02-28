package com.herd.squire.models.items.magical_item;

import java.util.HashMap;
import java.util.Map;

public enum MagicalItemType {
    ARMOR(1),
    POTION(2),
    RING(3),
    ROD(4),
    SCROLL(5),
    STAFF(6),
    WAND(7),
    WEAPON(8),
    WONDROUS(9),
    AMMO(10);

    private final int value;
    private static final Map<Integer, MagicalItemType> map = new HashMap<>();

    MagicalItemType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (MagicalItemType magicalItemType : MagicalItemType.values()) {
            map.put(magicalItemType.value, magicalItemType);
        }
    }

    public static MagicalItemType valueOf(int magicalItemType) {
        return map.get(magicalItemType);
    }
}
