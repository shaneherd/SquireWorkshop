package com.herd.squire.models.sharing;

import java.util.HashMap;
import java.util.Map;

public enum PublishType {
    NONE(0),
    PUBLIC(1),
    PRIVATE(2),
    UN_PUBLISH(3);

    private final int value;
    private static final Map<Integer, PublishType> map = new HashMap<>();

    PublishType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (PublishType publishType : PublishType.values()) {
            map.put(publishType.value, publishType);
        }
    }

    public static PublishType valueOf(int publishType) {
        return map.get(publishType);
    }
}
