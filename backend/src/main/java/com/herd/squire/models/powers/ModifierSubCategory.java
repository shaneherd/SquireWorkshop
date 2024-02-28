package com.herd.squire.models.powers;

import java.util.HashMap;
import java.util.Map;

public enum ModifierSubCategory {
    OTHER(1),
    SCORE(2),
    SAVE(3),
    PASSIVE(4);

    private final int value;
    private static final Map<Integer, ModifierSubCategory> map = new HashMap<>();

    ModifierSubCategory(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (ModifierSubCategory ModifierSubCategory : ModifierSubCategory.values()) {
            map.put(ModifierSubCategory.value, ModifierSubCategory);
        }
    }

    public static ModifierSubCategory valueOf(int ModifierSubCategory) {
        return map.get(ModifierSubCategory);
    }
}
