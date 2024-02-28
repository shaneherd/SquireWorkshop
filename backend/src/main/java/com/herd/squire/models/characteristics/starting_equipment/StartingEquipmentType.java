package com.herd.squire.models.characteristics.starting_equipment;

import java.util.HashMap;
import java.util.Map;

public enum StartingEquipmentType {
    ITEM(1),
    FILTER(2);

    private final int value;
    private static final Map<Integer, StartingEquipmentType> map = new HashMap<>();

    StartingEquipmentType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (StartingEquipmentType startingEquipmentType : StartingEquipmentType.values()) {
            map.put(startingEquipmentType.value, startingEquipmentType);
        }
    }

    public static StartingEquipmentType valueOf(int startingEquipmentType) {
        return map.get(startingEquipmentType);
    }
}
