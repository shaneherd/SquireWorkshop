package com.herd.squire.models.powers;

import java.util.HashMap;
import java.util.Map;

public enum ModifierCategory {
    MISC(1),
    ABILITY(2),
    SKILL(3),
    SPEED(4),
    SPELL(5),
    ATTACK(6),
    DAMAGE(7);

    private final int value;
    private static final Map<Integer, ModifierCategory> map = new HashMap<>();

    ModifierCategory(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (ModifierCategory modifierCategory : ModifierCategory.values()) {
            map.put(modifierCategory.value, modifierCategory);
        }
    }

    public static ModifierCategory valueOf(int modifierCategory) {
        return map.get(modifierCategory);
    }
}
