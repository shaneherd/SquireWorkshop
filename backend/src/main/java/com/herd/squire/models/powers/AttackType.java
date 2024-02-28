package com.herd.squire.models.powers;

import java.util.HashMap;
import java.util.Map;

public enum AttackType {
    ATTACK(1),
    SAVE(2),
    HEAL(3),
    NONE(4),
    DAMAGE(5);

    private final int value;
    private static final Map<Integer, AttackType> map = new HashMap<>();

    AttackType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (AttackType attackType : AttackType.values()) {
            map.put(attackType.value, attackType);
        }
    }

    public static AttackType valueOf(int attackType) {
        return map.get(attackType);
    }
}
