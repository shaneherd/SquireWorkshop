import { Injectable } from '@angular/core';
import {FilterKey} from '../components/filters/filter-key.enum';
import {FilterValue} from '../components/filters/filter-value';
import {TranslateService} from '@ngx-translate/core';
import {FilterOption} from '../components/filters/filter-option';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(
    private translate: TranslateService
  ) { }

  getFilterOption(value: string, options: FilterOption[]): FilterOption {
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (option.value === value) {
        return option;
      }
    }
    return null;
  }

  getFilterValue(key: FilterKey, filterValues: FilterValue[], defaultValue: string): FilterValue {
    for (let i = 0; i < filterValues.length; i++) {
      const filter = filterValues[i];
      if (filter.key === key) {
        return filter;
      }
    }

    const filterValue = new FilterValue();
    filterValue.key = key;
    filterValue.value = defaultValue;
    return filterValue;
  }

  getYesNoDisplay(value: string, action: string): string {
    if (value === '1') {
      return action;
    } else if (value === '0') {
      return this.translate.instant('Not') + ' ' + action;
    } else {
      return '';
    }
  }
}
