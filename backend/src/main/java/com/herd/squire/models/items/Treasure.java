package com.herd.squire.models.items;

public class Treasure extends Item {
    public Treasure() {}

    public Treasure(String id, String name, String description, int sid, boolean author, int version,
                    int cost, CostUnit costUnit, double weight) {
        super(id, name, ItemType.TREASURE, description, sid, author, version, false, false, null, false, false, cost, costUnit, weight);
    }
}
