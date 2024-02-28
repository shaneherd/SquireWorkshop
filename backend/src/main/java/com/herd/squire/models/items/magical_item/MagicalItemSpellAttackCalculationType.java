package com.herd.squire.models.items.magical_item;

import java.util.HashMap;
import java.util.Map;

public enum MagicalItemSpellAttackCalculationType {
    TABLE(1),
    CASTER(2),
    CUSTOM(3),
    NONE(4);

    private final int value;
    private static final Map<Integer, MagicalItemSpellAttackCalculationType> map = new HashMap<>();

    MagicalItemSpellAttackCalculationType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (MagicalItemSpellAttackCalculationType MagicalItemSpellAttackCalculationType : MagicalItemSpellAttackCalculationType.values()) {
            map.put(MagicalItemSpellAttackCalculationType.value, MagicalItemSpellAttackCalculationType);
        }
    }

    public static MagicalItemSpellAttackCalculationType valueOf(int MagicalItemSpellAttackCalculationType) {
        return map.get(MagicalItemSpellAttackCalculationType);
    }
}
