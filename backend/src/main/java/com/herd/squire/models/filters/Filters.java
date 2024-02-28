package com.herd.squire.models.filters;


import com.herd.squire.utilities.MySql;
import org.codehaus.jackson.annotate.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

public class Filters {
    private static final String FILTER_DELIMITER = "|";
    private static final String VALUE_DELIMITER = "=";

    private List<FilterValue> filterValues;
    private boolean filtersApplied;

    public Filters() {
        filterValues = new ArrayList<>();
    }

    public Filters(List<FilterValue> filterValues, boolean filtersApplied) {
        this.filterValues = filterValues;
        this.filtersApplied = filtersApplied;
    }

    public Filters(String filters, int userId) {
        if (filters == null) {
            return;
        }
        this.filterValues = new ArrayList<>();
        this.filtersApplied = false;
        String[] parts = filters.split("\\" + FILTER_DELIMITER);
        for (int i = 0; i < parts.length; i++) {
            String part = parts[i];
            String[] valueParts = part.split(VALUE_DELIMITER);
            if (valueParts.length == 2) {
                String key = valueParts[0];
                String value = valueParts[1];
                try {
                    long id = Long.parseLong(value);
                    value = MySql.encodeId(id, userId);
                } catch (Exception ignored) { }
                FilterValue filterValue = new FilterValue(FilterKey.valueOf(key), value);
                this.filterValues.add(filterValue);
                this.filtersApplied = true;
            }
        }
    }

    @JsonIgnore
    public String getFiltersString(int userId) throws Exception {
        List<String> parts = new ArrayList<>();
        for (int i = 0; i < filterValues.size(); i++) {
            FilterValue filterValue = filterValues.get(i);
            if (!filterValue.getValue().equals(FilterValue.DEFAULT_OPTION)) {
                FilterKey key = filterValue.getKey();
                if (key == FilterKey.WEAPON_DIFFICULTY || key == FilterKey.ARMOR_CATEGORY || key == FilterKey.TOOL_CATEGORY) {
                    long id = MySql.decodeId(filterValue.getValue(), userId);
                    parts.add(key + VALUE_DELIMITER + id);
                } else {
                    parts.add(key + VALUE_DELIMITER + filterValue.getValue());
                }
            }
        }
        return String.join(FILTER_DELIMITER, parts);
    }

    public List<FilterValue> getFilterValues() {
        return filterValues;
    }

    public void setFilterValues(List<FilterValue> filterValues) {
        this.filterValues = filterValues;
    }

    public boolean isFiltersApplied() {
        return filtersApplied;
    }

    public void setFiltersApplied(boolean filtersApplied) {
        this.filtersApplied = filtersApplied;
    }
}
