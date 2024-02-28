package com.herd.squire.models.sorts;

import java.util.ArrayList;
import java.util.List;

public class Sorts {
    private List<SortValue> sortValues;

    public Sorts() {
        sortValues = new ArrayList<>();
    }

    public Sorts(List<SortValue> sortValues) {
        this.sortValues = sortValues;
    }

    public List<SortValue> getSortValues() {
        return sortValues;
    }

    public void setSortValues(List<SortValue> sortValues) {
        this.sortValues = sortValues;
    }
}
