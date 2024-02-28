package com.herd.squire.models.user;

import java.util.HashMap;
import java.util.Map;

public enum UserTransactionType {
    CODE_REDEEMED(1),
    SUBSCRIBED(2),
    SUBSCRIPTION_CANCELED(3),
    PAYMENT_SUCCEEDED(4),
    SUBSCRIPTION_EXPIRED(5),
    ANDROID_TOKEN_CREATED(6),
    TEST(7);

    private final int value;
    private static final Map<Integer, UserTransactionType> map = new HashMap<>();

    UserTransactionType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (UserTransactionType UserTransactionType : UserTransactionType.values()) {
            map.put(UserTransactionType.value, UserTransactionType);
        }
    }

    public static UserTransactionType valueOf(int UserTransactionType) {
        return map.get(UserTransactionType);
    }
}
