package com.herd.squire.models.user;

import java.util.HashMap;
import java.util.Map;

public enum UserSubscriptionType {
    FREE(1),
    TRIAL(2),
    LIMITED(3),
    LIFETIME(4);

    private final int value;
    private static final Map<Integer, UserSubscriptionType> map = new HashMap<>();

    UserSubscriptionType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (UserSubscriptionType UserSubscriptionType : UserSubscriptionType.values()) {
            map.put(UserSubscriptionType.value, UserSubscriptionType);
        }
    }

    public static UserSubscriptionType valueOf(int UserSubscriptionType) {
        return map.get(UserSubscriptionType);
    }
}
