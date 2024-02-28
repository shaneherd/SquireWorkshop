package com.herd.squire.models.items;

import java.util.ArrayList;
import java.util.List;

public class Pack extends Item {
    private List<ItemQuantity> items;

    public Pack() {}

    public Pack(String id, String name, String description, int sid, boolean author, int version) {
        super(id, name, ItemType.PACK, description, sid, author, version, false, false, null, false, false, 0, null, 0);
        this.items = new ArrayList<>();
    }

    public List<ItemQuantity> getItems() {
        return items;
    }

    public void setItems(List<ItemQuantity> items) {
        this.items = items;
    }
}
