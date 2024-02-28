package com.herd.squire.models.monsters;

import java.util.HashMap;
import java.util.Map;

public enum MonsterType {
    ABERRATION(1),
    BEAST(2),
    CELESTIAL(3),
    CONSTRUCT(4),
    DRAGON(5),
    ELEMENTAL(6),
    FEY(7),
    FIEND(8),
    GIANT(9),
    HUMANOID(10),
    MONSTROSITY(11),
    OOZE(12),
    PLANT(13),
    UNDEAD(14);

    private final int value;
    private static final Map<Integer, MonsterType> map = new HashMap<>();

    MonsterType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (MonsterType monsterType : MonsterType.values()) {
            map.put(monsterType.value, monsterType);
        }
    }

    public static MonsterType valueOf(int monsterType) {
        return map.get(monsterType);
    }
}
