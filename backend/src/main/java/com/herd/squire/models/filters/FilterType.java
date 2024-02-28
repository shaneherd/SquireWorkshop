package com.herd.squire.models.filters;

import java.util.HashMap;
import java.util.Map;

public enum FilterType {
    ITEM(1),
    SPELL(2),
    FEATURE(3),
    SKILL(4),
    NOTE(5),
    COMPANION(6),
    CONDITION(7);

    private final int value;
    private static final Map<Integer, FilterType> map = new HashMap<>();

    FilterType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (FilterType filterType : FilterType.values()) {
            map.put(filterType.value, filterType);
        }
    }

    public static FilterType valueOf(int filterType) {
        return map.get(filterType);
    }
}
