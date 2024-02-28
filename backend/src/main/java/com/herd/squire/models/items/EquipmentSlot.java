package com.herd.squire.models.items;

public class EquipmentSlot {
    private String id;
    private String name;
    private EquipmentSlotType equipmentSlotType;

    public EquipmentSlot() {}

    public EquipmentSlot(String id, String name, EquipmentSlotType equipmentSlotType) {
        this.id = id;
        this.name = name;
        this.equipmentSlotType = equipmentSlotType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public EquipmentSlotType getEquipmentSlotType() {
        return equipmentSlotType;
    }

    public void setEquipmentSlotType(EquipmentSlotType equipmentSlotType) {
        this.equipmentSlotType = equipmentSlotType;
    }
}
