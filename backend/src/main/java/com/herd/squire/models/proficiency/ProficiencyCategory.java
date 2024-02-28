package com.herd.squire.models.proficiency;

import java.util.HashMap;
import java.util.Map;

public enum ProficiencyCategory {
    ATTRIBUTE(1),
    ITEM(2);

    private final int value;
    private static final Map<Integer, ProficiencyCategory> map = new HashMap<>();

    ProficiencyCategory(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (ProficiencyCategory proficiencyCategory : ProficiencyCategory.values()) {
            map.put(proficiencyCategory.value, proficiencyCategory);
        }
    }

    public static ProficiencyCategory valueOf(int proficiencyCategory) {
        return map.get(proficiencyCategory);
    }
}
