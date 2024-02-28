package com.herd.squire.models;

import com.herd.squire.models.filters.Filters;
import com.herd.squire.models.sorts.Sorts;

public class FilterSorts {
    private Filters filters;
    private Sorts sorts;

    public FilterSorts() {
        filters = new Filters();
        sorts = new Sorts();
    }

    public FilterSorts(Filters filters, Sorts sorts) {
        this.filters = filters;
        this.sorts = sorts;
    }

    public Filters getFilters() {
        return filters;
    }

    public void setFilters(Filters filters) {
        this.filters = filters;
    }

    public Sorts getSorts() {
        return sorts;
    }

    public void setSorts(Sorts sorts) {
        this.sorts = sorts;
    }
}
