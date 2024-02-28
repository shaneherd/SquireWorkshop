package com.herd.squire.models.items;

public class Vehicle extends Item {
    public Vehicle() {}

    public Vehicle(String id, String name, String description, int sid, boolean author, int version,
                   int cost, CostUnit costUnit, double weight) {
        super(id, name, ItemType.VEHICLE, description, sid, author, version, false, false, null, true, false, cost, costUnit, weight);
    }
}
