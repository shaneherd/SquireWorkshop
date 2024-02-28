package com.herd.squire.models.sorts;

import java.util.HashMap;
import java.util.Map;

public enum SortKey {
    NAME(1),
    LEVEL(2),
    CATEGORY(3),
    DATE(4),
    ABILITY(5);

    private final int value;
    private static final Map<Integer, SortKey> map = new HashMap<>();

    SortKey(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (SortKey sortKey : SortKey.values()) {
            map.put(sortKey.value, sortKey);
        }
    }

    public static SortKey valueOf(int sortKey) {
        return map.get(sortKey);
    }
}
