package com.herd.squire.models.items;

public class Mount extends Item {
    private int speed;
    private int carryingCapacity;

    public Mount() {}

    public Mount(String id, String name, String description, int sid, boolean author, int version, int cost,
                 CostUnit costUnit, double weight, int speed, int carryingCapacity) {
        super(id, name, ItemType.MOUNT, description, sid, author, version, false, true, EquipmentSlotType.MOUNT, true, false, cost, costUnit, weight);
        this.speed = speed;
        this.carryingCapacity = carryingCapacity;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }

    public int getCarryingCapacity() {
        return carryingCapacity;
    }

    public void setCarryingCapacity(int carryingCapacity) {
        this.carryingCapacity = carryingCapacity;
    }
}
