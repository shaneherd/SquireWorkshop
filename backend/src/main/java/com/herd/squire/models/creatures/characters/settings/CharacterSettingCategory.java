package com.herd.squire.models.creatures.characters.settings;

import java.util.HashMap;
import java.util.Map;

public enum CharacterSettingCategory {
    GENERIC(1),
    EQUIPMENT(2),
    HEALTH(3),
    SPEED(4),
    SPELLCASTING(5),
    FEATURES(6),
    SKILLS(7),
    VALIDATION(8),
    QUICK_ACTION(9);

    private final int value;
    private static final Map<Integer, CharacterSettingCategory> map = new HashMap<>();

    CharacterSettingCategory(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CharacterSettingCategory CharacterSettingCategory : CharacterSettingCategory.values()) {
            map.put(CharacterSettingCategory.value, CharacterSettingCategory);
        }
    }

    public static CharacterSettingCategory valueOf(int CharacterSettingCategory) {
        return map.get(CharacterSettingCategory);
    }
}
