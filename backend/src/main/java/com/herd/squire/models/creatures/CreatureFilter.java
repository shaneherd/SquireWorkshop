package com.herd.squire.models.creatures;

import com.herd.squire.models.filters.FilterType;
import com.herd.squire.models.filters.FilterValue;

import java.util.List;

public class CreatureFilter {
    private FilterType filterType;
    private List<FilterValue> filterValues;

    public CreatureFilter() {}

    public CreatureFilter(FilterType filterType, List<FilterValue> filterValues) {
        this.filterType = filterType;
        this.filterValues = filterValues;
    }

    public FilterType getFilterType() {
        return filterType;
    }

    public void setFilterType(FilterType filterType) {
        this.filterType = filterType;
    }

    public List<FilterValue> getFilterValues() {
        return filterValues;
    }

    public void setFilterValues(List<FilterValue> filterValues) {
        this.filterValues = filterValues;
    }
}
