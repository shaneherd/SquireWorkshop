package com.herd.squire.models.items;

public class Gear extends Item {
    public Gear() {
    }

    public Gear(String id, String name, String description, int sid, boolean author, int version,
                boolean expendable, boolean equippable,
                EquipmentSlotType slot, boolean container, boolean ignoreWeight, int cost, CostUnit costUnit, double weight) {
        super(id, name, ItemType.GEAR, description, sid, author, version, expendable, equippable, slot, container, ignoreWeight, cost, costUnit, weight);
    }
}
