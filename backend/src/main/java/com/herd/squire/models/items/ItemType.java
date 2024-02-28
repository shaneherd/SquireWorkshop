package com.herd.squire.models.items;

import java.util.HashMap;
import java.util.Map;

public enum ItemType {
    WEAPON(1),
    ARMOR(2),
    GEAR(3),
    TOOL(4),
    AMMO(5),
    MOUNT(6),
    TREASURE(7),
    PACK(8),
    MAGICAL_ITEM(9),
    VEHICLE(10);

    private final int value;
    private static final Map<Integer, ItemType> map = new HashMap<Integer, ItemType>();

    ItemType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (ItemType itemType : ItemType.values()) {
            map.put(itemType.value, itemType);
        }
    }

    public static ItemType valueOf(int itemType) {
        return map.get(itemType);
    }
}
