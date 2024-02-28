package com.herd.squire.models.items;

public class ItemQuantity {
    protected ItemListObject item;
    protected int quantity;
    protected boolean author;

    public ItemQuantity() {}

    public ItemQuantity(ItemListObject item, int quantity) {
        this.item = item;
        this.quantity = quantity;
        this.author = true;
    }

    public ItemQuantity(ItemListObject item, int quantity, boolean author) {
        this.item = item;
        this.quantity = quantity;
        this.author = author;
    }

    public ItemListObject getItem() {
        return item;
    }

    public void setItem(ItemListObject item) {
        this.item = item;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public boolean isAuthor() {
        return author;
    }

    public void setAuthor(boolean author) {
        this.author = author;
    }
}
