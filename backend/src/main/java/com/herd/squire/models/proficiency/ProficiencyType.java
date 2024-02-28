package com.herd.squire.models.proficiency;

import java.util.HashMap;
import java.util.Map;

public enum ProficiencyType {
    ABILITY(ProficiencyCategory.ATTRIBUTE, 1),
    ARMOR_TYPE(ProficiencyCategory.ATTRIBUTE, 2),
    LANGUAGE(ProficiencyCategory.ATTRIBUTE, 6),
    SKILL(ProficiencyCategory.ATTRIBUTE, 8),
    TOOL_CATEGORY(ProficiencyCategory.ATTRIBUTE, 9),
    WEAPON_TYPE(ProficiencyCategory.ATTRIBUTE, 11),
    MISC(ProficiencyCategory.ATTRIBUTE, 17),
    ARMOR(ProficiencyCategory.ITEM, 2),
    TOOL(ProficiencyCategory.ITEM, 4),
    WEAPON(ProficiencyCategory.ITEM, 1);

    private final int value;
    private final ProficiencyCategory proficiencyCategory;

    private static final Map<ProficiencyCategory, Map<Integer, ProficiencyType>> map = new HashMap<>();

    ProficiencyType(ProficiencyCategory proficiencyCategory, int value) {
        this.proficiencyCategory = proficiencyCategory;
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public ProficiencyCategory getProficiencyCategory() {
        return proficiencyCategory;
    }

    static {
        for (ProficiencyType proficiencyType : ProficiencyType.values()) {
            Map<Integer, ProficiencyType> entry = map.computeIfAbsent(proficiencyType.getProficiencyCategory(), k -> new HashMap<>());
            entry.put(proficiencyType.value, proficiencyType);
        }
    }

    public static ProficiencyType valueOf(ProficiencyCategory proficiencyCategory, int proficiencyType) {
        Map<Integer, ProficiencyType> categoryMap = map.get(proficiencyCategory);
        return categoryMap.get(proficiencyType);
    }
}
