package com.herd.squire.models.characteristics.starting_equipment;

import com.herd.squire.models.ListObject;
import com.herd.squire.models.filters.Filters;

public class StartingEquipment {
    private int itemGroup;
    private int itemOption;
    private StartingEquipmentType startingEquipmentType;
    private ListObject item;
    private Filters filters;
    private int quantity;

    public StartingEquipment() {}

    public StartingEquipment(int itemGroup, int itemOption, StartingEquipmentType startingEquipmentType,
                             ListObject item, Filters filters, int quantity) {
        this.itemGroup = itemGroup;
        this.itemOption = itemOption;
        this.startingEquipmentType = startingEquipmentType;
        this.item = item;
        this.filters = filters;
        this.quantity = quantity;
    }

    public int getItemGroup() {
        return itemGroup;
    }

    public void setItemGroup(int itemGroup) {
        this.itemGroup = itemGroup;
    }

    public int getItemOption() {
        return itemOption;
    }

    public void setItemOption(int itemOption) {
        this.itemOption = itemOption;
    }

    public StartingEquipmentType getStartingEquipmentType() {
        return startingEquipmentType;
    }

    public void setStartingEquipmentType(StartingEquipmentType startingEquipmentType) {
        this.startingEquipmentType = startingEquipmentType;
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
