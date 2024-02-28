package com.herd.squire.models;

import java.util.HashMap;
import java.util.Map;

public enum GroupCheckType {
    GROUP(1),
    LOWEST(2);

    private final int value;
    private static final Map<Integer, GroupCheckType> map = new HashMap<>();

    GroupCheckType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (GroupCheckType groupCheckType : GroupCheckType.values()) {
            map.put(groupCheckType.value, groupCheckType);
        }
    }

    public static GroupCheckType valueOf(int groupCheckType) {
        return map.get(groupCheckType);
    }
}
