package com.herd.squire.models;

import java.util.HashMap;
import java.util.Map;

public enum SupportRequestSubject {
    REPORT_A_BUG(1),
    FEATURE_REQUEST(2),
    OTHER(3);

    private final int value;
    private static final Map<Integer, SupportRequestSubject> map = new HashMap<>();

    SupportRequestSubject(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (SupportRequestSubject subject : SupportRequestSubject.values()) {
            map.put(subject.value, subject);
        }
    }

    public static SupportRequestSubject valueOf(int action) {
        return map.get(action);
    }
}
