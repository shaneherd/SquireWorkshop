import {Component, Input} from '@angular/core';
import {FilterValue} from '../filter-value';
import {FilterOption} from '../filter-option';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input() filterValue: FilterValue;
  @Input() options: FilterOption[] = [];

  constructor() { }
}
