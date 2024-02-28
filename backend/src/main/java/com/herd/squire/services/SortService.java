package com.herd.squire.services;

import com.herd.squire.models.creatures.CreatureSort;
import com.herd.squire.models.sorts.SortType;
import com.herd.squire.models.sorts.SortValue;

import java.util.ArrayList;
import java.util.List;

public class SortService {
    public static String getSortDirection(boolean ascending) {
        return ascending ? "ASC" : "DESC";
    }

    public static List<SortValue> getSorts(List<CreatureSort> sorts, SortType sortType) {
        if (sorts != null) {
            for (CreatureSort sort : sorts) {
                if (sort.getSortType() == sortType) {
                    return sort.getSortValues();
                }
            }
        }
        return new ArrayList<>();
    }

    public static SortValue getSortValue(List<SortValue> sortValues) {
        if (sortValues == null || sortValues.isEmpty()) {
            return null;
        }
        return sortValues.get(0);
    }
}
