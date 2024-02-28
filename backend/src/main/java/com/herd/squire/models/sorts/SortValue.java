package com.herd.squire.models.sorts;

public class SortValue {
    private SortKey sortKey;
    private boolean ascending;

    public SortValue() {}

    public SortValue(SortKey sortKey, boolean ascending) {
        this.sortKey = sortKey;
        this.ascending = ascending;
    }

    public SortKey getSortKey() {
        return sortKey;
    }

    public void setSortKey(SortKey sortKey) {
        this.sortKey = sortKey;
    }

    public boolean isAscending() {
        return ascending;
    }

    public void setAscending(boolean ascending) {
        this.ascending = ascending;
    }
}
