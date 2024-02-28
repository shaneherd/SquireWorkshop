package com.herd.squire.models.creatures;

import com.herd.squire.models.items.SelectionItem;

import java.util.ArrayList;
import java.util.List;

public class CreatureInventory {
    private List<SelectionItem> items;
    private String containerId;

    public CreatureInventory() {
        this.items = new ArrayList<>();
        this.containerId = "0";
    }

    public CreatureInventory(List<SelectionItem> items, String containerId) {
        this.items = items;
        this.containerId = containerId;
    }

    public List<SelectionItem> getItems() {
        return items;
    }

    public void setItems(List<SelectionItem> items) {
        this.items = items;
    }

    public String getContainerId() {
        return containerId;
    }

    public void setContainerId(String containerId) {
        this.containerId = containerId;
    }
}
