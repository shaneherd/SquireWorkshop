package com.herd.squire.models;

import java.util.HashMap;
import java.util.Map;

public enum ListSource {
    MY_STUFF(1),
    PUBLIC_CONTENT(2),
    PRIVATE_CONTENT(3);

    private final int value;
    private static final Map<Integer, ListSource> map = new HashMap<>();

    ListSource(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (ListSource ListSource : ListSource.values()) {
            map.put(ListSource.value, ListSource);
        }
    }

    public static ListSource valueOf(int ListSource) {
        return map.get(ListSource);
    }
}
