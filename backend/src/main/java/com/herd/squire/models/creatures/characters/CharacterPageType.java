package com.herd.squire.models.creatures.characters;

import java.util.HashMap;
import java.util.Map;

public enum CharacterPageType {
    ABILITIES(1),
    QUICK_ACTIONS(2),
    SPELLS(3),
    INNATE_SPELLS(4), //todo - remove this
    SKILLS(5),
    FEATURES(6),
    CONDITIONS(7),
    PROFICIENCIES(8),
    DAMAGE_MODIFIERS(9),
    COMPANIONS(10),
    EQUIPMENT(11),
    CHARACTERISTICS(12),
    NOTES(13),
    BASIC(14);

    private final int value;
    private static final Map<Integer, CharacterPageType> map = new HashMap<>();

    CharacterPageType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (CharacterPageType characterPageType : CharacterPageType.values()) {
            map.put(characterPageType.value, characterPageType);
        }
    }

    public static CharacterPageType valueOf(int characterPageType) {
        return map.get(characterPageType);
    }
}
