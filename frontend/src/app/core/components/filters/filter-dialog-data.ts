import {Filters} from './filters';
import {Tag} from '../../../shared/models/tag';
import {FilterDataOptionKey} from './filter-data-option-key.enum';
import {ListSource} from '../../../shared/models/list-source.enum';

export class FilterDialogData {
  apply: any;
  clear: any;
  filters: Filters;
  options = new Map<FilterDataOptionKey, boolean>();
  tags: Tag[] = [];
  listSource: ListSource = ListSource.MY_STUFF;
}
