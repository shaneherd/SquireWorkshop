package com.herd.squire.models.items;

import java.util.ArrayList;
import java.util.List;

public class ItemListResponse {
    private List<ItemListObject> items;
    private boolean hasMore;

    public ItemListResponse() {
        this.items = new ArrayList<>();
    }

    public ItemListResponse(List<ItemListObject> items, boolean hasMore) {
        this.items = items;
        this.hasMore = hasMore;
    }

    public List<ItemListObject> getItems() {
        return items;
    }

    public void setItems(List<ItemListObject> items) {
        this.items = items;
    }

    public boolean isHasMore() {
        return hasMore;
    }

    public void setHasMore(boolean hasMore) {
        this.hasMore = hasMore;
    }
}
