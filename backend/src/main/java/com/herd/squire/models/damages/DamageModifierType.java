package com.herd.squire.models.damages;

import java.util.HashMap;
import java.util.Map;

public enum DamageModifierType {
    NORMAL(1, 1),
    VULNERABLE(2, 2),
    RESISTANT(3, 0.5),
    IMMUNE(4, 0);

    private final int value;
    private final double multiplier;
    private static final Map<Integer, DamageModifierType> map = new HashMap<>();

    DamageModifierType(int value, double multiplier) {
        this.value = value;
        this.multiplier = multiplier;
    }

    public int getValue() {
        return value;
    }

    public double getMultiplier() {
        return multiplier;
    }

    static {
        for (DamageModifierType damageModifierType : DamageModifierType.values()) {
            map.put(damageModifierType.value, damageModifierType);
        }
    }

    public static DamageModifierType valueOf(int damageModifierType) {
        return map.get(damageModifierType);
    }
}
