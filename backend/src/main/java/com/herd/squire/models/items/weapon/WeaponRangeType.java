package com.herd.squire.models.items.weapon;

import java.util.HashMap;
import java.util.Map;

public enum WeaponRangeType {
    MELEE(1),
    RANGED(2);

    private final int value;
    private static final Map<Integer, WeaponRangeType> map = new HashMap<>();

    WeaponRangeType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (WeaponRangeType weaponRangeType : WeaponRangeType.values()) {
            map.put(weaponRangeType.value, weaponRangeType);
        }
    }

    public static WeaponRangeType valueOf(int weaponRangeType) {
        return map.get(weaponRangeType);
    }
}
