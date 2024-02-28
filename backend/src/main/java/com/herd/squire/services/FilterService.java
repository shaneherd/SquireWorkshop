package com.herd.squire.services;

import com.herd.squire.models.creatures.CreatureFilter;
import com.herd.squire.models.filters.FilterKey;
import com.herd.squire.models.filters.FilterType;
import com.herd.squire.models.filters.FilterValue;

import java.util.ArrayList;
import java.util.List;

public class FilterService {
    public static String getFilterValue(List<FilterValue> filterValues, FilterKey filterKey) {
        if (filterValues == null) {
            return null;
        }

        for (int i = 0; i < filterValues.size(); i++) {
            FilterValue filterValue = filterValues.get(i);
            if (filterValue.getKey() == filterKey) {
                return filterValue.getValue();
            }
        }
        return null;
    }

    public static void setFilterValue(List<FilterValue> filterValues, FilterKey filterKey, String value) {
        if (filterValues == null) {
            return;
        }
        for (FilterValue filterValue : filterValues) {
            if (filterValue.getKey() == filterKey) {
                filterValue.setValue(value);
            }
        }
    }

    public static String getSearchValue(List<FilterValue> filterValues) {
        String value = getFilterValue(filterValues, FilterKey.SEARCH);
        String search = "";
        if (value != null && value.length() > 0) {
            search = "%" + value + "%";
        }
        return search;
    }

    public static Boolean getFilterBoolean(List<FilterValue> filterValues, FilterKey filterKey) {
        String value = getFilterValue(filterValues, filterKey);
        if (value == null || value.equals(FilterValue.DEFAULT_OPTION)) {
            return null;
        }
        return value.equals(FilterValue.YES);
    }

    public static List<FilterValue> getFilters(List<CreatureFilter> filters, FilterType filterType) {
        if (filters != null) {
            for (CreatureFilter filter : filters) {
                if (filter.getFilterType() == filterType) {
                    return filter.getFilterValues();
                }
            }
        }
        return new ArrayList<>();
    }

    public static List<FilterKey> getAttributeKeys() {
        List<FilterKey> keys = new ArrayList<>();
        keys.add(FilterKey.WEAPON_DIFFICULTY);
        keys.add(FilterKey.ARMOR_CATEGORY);
        keys.add(FilterKey.TOOL_CATEGORY);
        keys.add(FilterKey.LEVEL);
        keys.add(FilterKey.FEATURE_AREA_OF_EFFECT);
        keys.add(FilterKey.SCHOOL);
        keys.add(FilterKey.SPELL_AREA_OF_EFFECT);
        return keys;
    }

    public static List<FilterKey> getCharacteristicKeys() {
        List<FilterKey> keys = new ArrayList<>();
        keys.add(FilterKey.FEATURE_CLASS);
        keys.add(FilterKey.FEATURE_RACE);
        keys.add(FilterKey.FEATURE_BACKGROUND);
        keys.add(FilterKey.SPELL_CLASS);
        return keys;
    }
}
