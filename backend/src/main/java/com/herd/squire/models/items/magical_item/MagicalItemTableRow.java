package com.herd.squire.models.items.magical_item;

import java.util.ArrayList;
import java.util.List;

public class MagicalItemTableRow {
    private List<String> values;

    public MagicalItemTableRow() {
        this.values = new ArrayList<>();
    }

    public List<String> getValues() {
        return values;
    }

    public void setValues(List<String> values) {
        this.values = values;
    }
}
