package com.herd.squire.models.characteristics.starting_equipment;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.filters.Filters;

public class StartingEquipmentItem {
    private StartingEquipmentType itemType;
    private ListObject item;
    private Filters filters;
    private int quantity;

    public StartingEquipmentItem() {}

    public StartingEquipmentItem(StartingEquipmentType itemType, ListObject item, Filters filters, int quantity) {
        this.itemType = itemType;
        this.item = item;
        this.filters = filters;
        this.quantity = quantity;
    }

    public StartingEquipmentType getItemType() {
        return itemType;
    }

    public void setItemType(StartingEquipmentType itemType) {
        this.itemType = itemType;
    }

    public ListObject getItem() {
        return item;
    }

    public void setItem(ListObject item) {
        this.item = item;
    }

    public Filters getFilters() {
        return filters;
    }

    public void setFilters(Filters filters) {
        this.filters = filters;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
