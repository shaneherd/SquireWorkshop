package com.herd.squire.models.sorts;

import java.util.HashMap;
import java.util.Map;

public enum SortType {
    ITEM(1),
    SPELL(2),
    FEATURE(3),
    SKILL(4),
    NOTE(5),
    COMPANION(6),
    CONDITION(7);

    private final int value;
    private static final Map<Integer, SortType> map = new HashMap<>();

    SortType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (SortType sortType : SortType.values()) {
            map.put(sortType.value, sortType);
        }
    }

    public static SortType valueOf(int sortType) {
        return map.get(sortType);
    }
}
