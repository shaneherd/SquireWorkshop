import {Injectable} from '@angular/core';
import {Filters} from '../../components/filters/filters';
import {FilterKey} from '../../components/filters/filter-key.enum';
import {FilterValue} from '../../components/filters/filter-value';
import {DEFAULT_FILTER_TAG_VALUE, DEFAULT_FILTER_VALUE} from '../../../constants';
import {FilterDialogData} from '../../components/filters/filter-dialog-data';

@Injectable({
  providedIn: 'root'
})
export class FeatureFilterService {
  defaultOption = DEFAULT_FILTER_VALUE;
  defaultTags = DEFAULT_FILTER_TAG_VALUE;

  constructor() { }

  initializeFilters(data: FilterDialogData): Filters {
    const filters = new Filters();
    const keys = this.getKeys();
    keys.forEach((key: FilterKey) => {
      const option = key === FilterKey.TAGS ? this.defaultTags : this.defaultOption;
      filters.filterValues.push(this.getFilterValue(key, data, option));
    });
    return filters;
  }

  getKeys(): FilterKey[] {
    const keys: FilterKey[] = [];
    keys.push(FilterKey.ACTIVE);
    keys.push(FilterKey.PASSIVE);
    keys.push(FilterKey.FEATURE_CATEGORY);
    keys.push(FilterKey.FEATURE_CLASS);
    keys.push(FilterKey.FEATURE_RACE);
    keys.push(FilterKey.FEATURE_BACKGROUND);
    keys.push(FilterKey.LEVEL);
    keys.push(FilterKey.RANGE);
    keys.push(FilterKey.AREA_OF_EFFECT);
    keys.push(FilterKey.FEATURE_AREA_OF_EFFECT);
    keys.push(FilterKey.TAGS);
    return keys;
  }

  private getFilterValue(key: FilterKey, data: FilterDialogData, defaultValue: string): FilterValue {
    if (data != null) {
      for (let i = 0; i < data.filters.filterValues.length; i++) {
        const filter = data.filters.filterValues[i];
        if (filter.key === key) {
          return filter;
        }
      }
    }

    const filterValue = new FilterValue();
    filterValue.key = key;
    filterValue.value = defaultValue;
    return filterValue;
  }
}
