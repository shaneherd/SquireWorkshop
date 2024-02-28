package com.herd.squire.models.items;

public class AddItemResponse {
    private ItemListObject item;
    private String creatureItemId;

    public AddItemResponse() {}

    public AddItemResponse(ItemListObject item, String creatureItemId) {
        this.item = item;
        this.creatureItemId = creatureItemId;
    }

    public ItemListObject getItem() {
        return item;
    }

    public void setItem(ItemListObject item) {
        this.item = item;
    }

    public String getCreatureItemId() {
        return creatureItemId;
    }

    public void setCreatureItemId(String creatureItemId) {
        this.creatureItemId = creatureItemId;
    }
}
