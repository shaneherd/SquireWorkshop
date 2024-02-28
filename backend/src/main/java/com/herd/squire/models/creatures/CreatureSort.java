package com.herd.squire.models.creatures;

import com.herd.squire.models.sorts.SortType;
import com.herd.squire.models.sorts.SortValue;

import java.util.List;

public class CreatureSort {
    private SortType sortType;
    private List<SortValue> sortValues;

    public CreatureSort() {}

    public CreatureSort(SortType sortType, List<SortValue> sortValues) {
        this.sortType = sortType;
        this.sortValues = sortValues;
    }

    public SortType getSortType() {
        return sortType;
    }

    public void setSortType(SortType sortType) {
        this.sortType = sortType;
    }

    public List<SortValue> getSortValues() {
        return sortValues;
    }

    public void setSortValues(List<SortValue> sortValues) {
        this.sortValues = sortValues;
    }
}
