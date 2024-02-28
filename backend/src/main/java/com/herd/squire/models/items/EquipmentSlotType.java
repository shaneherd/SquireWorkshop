package com.herd.squire.models.items;

import java.util.HashMap;
import java.util.Map;

public enum EquipmentSlotType {
    NONE(1),
    HAND(2),
    BODY(3),
    BACK(4),
    NECK(5),
    GLOVES(6),
    FINGER(7),
    HEAD(8),
    WAIST(9),
    FEET(10),
    MOUNT(11);

    private final int value;
    private static final Map<Integer, EquipmentSlotType> map = new HashMap<>();

    EquipmentSlotType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    static {
        for (EquipmentSlotType equipmentSlotType : EquipmentSlotType.values()) {
            map.put(equipmentSlotType.value, equipmentSlotType);
        }
    }

    public static EquipmentSlotType valueOf(int equipmentSlotType) {
        return map.get(equipmentSlotType);
    }
}
