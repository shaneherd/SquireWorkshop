package com.herd.squire.models;

import java.util.HashMap;
import java.util.Map;

public enum SupportRequestStatus {
    PENDING(1),
    REVIEWING(2),
    COMPLETE(3);

    private final int value;
    private static final Map<Integer, SupportRequestStatus> map = new HashMap<>();

    SupportRequestStatus(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (SupportRequestStatus subject : SupportRequestStatus.values()) {
            map.put(subject.value, subject);
        }
    }

    public static SupportRequestStatus valueOf(int action) {
        return map.get(action);
    }
}
