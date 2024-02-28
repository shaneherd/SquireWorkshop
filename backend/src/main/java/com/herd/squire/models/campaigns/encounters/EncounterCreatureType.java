package com.herd.squire.models.campaigns.encounters;

import java.util.HashMap;
import java.util.Map;

public enum EncounterCreatureType {
    CHARACTER(1),
    MONSTER(2);

    private final int value;
    private static final Map<Integer, EncounterCreatureType> map = new HashMap<>();

    EncounterCreatureType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (EncounterCreatureType EncounterCreatureType : EncounterCreatureType.values()) {
            map.put(EncounterCreatureType.value, EncounterCreatureType);
        }
    }

    public static EncounterCreatureType valueOf(int EncounterCreatureType) {
        return map.get(EncounterCreatureType);
    }
}
