package com.herd.squire.models.items;

import java.util.ArrayList;
import java.util.List;

public class ItemQuantityList {
    private List<ItemQuantity> items;

    public ItemQuantityList() {
        this.items = new ArrayList<>();
    }

    public ItemQuantityList(List<ItemQuantity> items) {
        this.items = items;
    }

    public List<ItemQuantity> getItems() {
        return items;
    }

    public void setItems(List<ItemQuantity> items) {
        this.items = items;
    }
}
