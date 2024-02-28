package com.herd.squire.models.creatures;

import java.util.ArrayList;
import java.util.List;

public class CreatureItemsRequest {
    private List<CreatureItemRequest> items;

    public CreatureItemsRequest() {
        this.items = new ArrayList<>();
    }

    public CreatureItemsRequest(List<CreatureItemRequest> items) {
        this.items = items;
    }

    public List<CreatureItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CreatureItemRequest> items) {
        this.items = items;
    }
}
