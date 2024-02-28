import {FilterValue} from '../../../core/components/filters/filter-value';
import {FilterType} from '../../../core/components/filters/filter-type.enum';

export class CreatureFilter {
  filterType: FilterType;
  filterValues: FilterValue[] = [];
}
