package com.herd.squire.models.inUse;

import com.herd.squire.models.items.ItemType;

public class InUseItem extends InUse {
    private ItemType itemType;

    public InUseItem() {
        super();
    }

    public InUseItem(int subTypeId, String id, String name, boolean required) {
        super(id, name, required, InUseType.ITEM);
        this.itemType = ItemType.valueOf(subTypeId);
    }

    public ItemType getItemType() {
        return itemType;
    }

    public void setItemType(ItemType itemType) {
        this.itemType = itemType;
    }
}
