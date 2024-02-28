package com.herd.squire.models.attributes;

import java.util.HashMap;
import java.util.Map;

public enum AttributeType {
    NONE(0),
    ABILITY(1),
    ARMOR_TYPE(2),
    CASTER_TYPE(3),
    CONDITION(4),
    DAMAGE_TYPE(5),
    LANGUAGE(6),
    LEVEL(7),
    SKILL(8),
    TOOL_CATEGORY(9),
    WEAPON_PROPERTY(10),
    WEAPON_TYPE(11),
    AREA_OF_EFFECT(12),
    SPELL_SCHOOL(13),
    ALIGNMENT(14),
    DEITY_CATEGORY(15),
    DEITY(16),
    MISC(17);

    private final int value;
    private static final Map<Integer, AttributeType> map = new HashMap<>();

    AttributeType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (AttributeType attributeType : AttributeType.values()) {
            map.put(attributeType.value, attributeType);
        }
    }

    public static AttributeType valueOf(int attributeType) {
        return map.get(attributeType);
    }
}
