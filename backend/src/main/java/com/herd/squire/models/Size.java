package com.herd.squire.models;

import java.util.HashMap;
import java.util.Map;

public enum Size {
    TINY(1),
    SMALL(2),
    MEDIUM(3),
    LARGE(4),
    HUGE(5),
    GARGUANTUAN(6);

    private final int value;
    private static final Map<Integer, Size> map = new HashMap<>();

    Size(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (Size size : Size.values()) {
            map.put(size.value, size);
        }
    }

    public static Size valueOf(int size) {
        return map.get(size);
    }
}
