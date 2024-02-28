import {Filters} from '../../core/components/filters/filters';
import {Sorts} from '../../core/components/sorts/sorts';

export class FilterSorts {
  filters: Filters;
  sorts: Sorts;

  constructor(filters: Filters, sorts: Sorts) {
    this.filters = filters == null ? new Filters() : filters;
    this.sorts = sorts == null ? new Sorts() : sorts;
  }
}
