package com.herd.squire.models.filters;

import java.util.HashMap;
import java.util.Map;

public enum FilterKey {
    ITEM_TYPE(1),
    WEAPON_DIFFICULTY(2),
    WEAPON_CATEGORY(3),
    ARMOR_CATEGORY(4),
    TOOL_CATEGORY(5),
    EXPENDABLE(6),
    EQUIPPABLE(7),
    CONTAINER(8),
    MAGICAL_TYPE(9),
    RARITY(10),
    ATTUNEMENT(11),
    CURSED(12),
    FEATURE_CATEGORY(13),
    FEATURE_CLASS(14),
    FEATURE_RACE(15),
    FEATURE_BACKGROUND(16),
    LEVEL(17),
    RANGE(18),
    AREA_OF_EFFECT(19),
    FEATURE_AREA_OF_EFFECT(20),
    SPELL_CLASS(21),
    SCHOOL(22),
    RITUAL(23),
    SPELL_AREA_OF_EFFECT(24),
    VERBAL(25),
    SOMATIC(26),
    MATERIAL(27),
    CONCENTRATION(28),
    INSTANTANEOUS(29),
    NOTE_CATEGORY(30),
    TAGS(31),
    PREPARED(32),
    ACTIVE(33),
    PASSIVE(34),
    CONCENTRATING(35),
    SEARCH(36),
    MONSTER_TYPE(37),
    CHALLENGE_RATING(38),
    ALIGNMENT(39),
    SPELLCASTER(40),
    LEGENDARY(41),
    FLYING(42),
    SWIMMING(43);

    private final int value;
    private static final Map<Integer, FilterKey> map = new HashMap<>();

    FilterKey(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (FilterKey filterKey : FilterKey.values()) {
            map.put(filterKey.value, filterKey);
        }
    }

    public static FilterKey valueOf(int filterKey) {
        return map.get(filterKey);
    }
}
