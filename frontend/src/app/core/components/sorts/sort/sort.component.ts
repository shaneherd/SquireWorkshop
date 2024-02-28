import {Component, Input} from '@angular/core';
import {SortValue} from '../sort-value';
import {SortKey} from '../sort-key.enum';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent {
  @Input() sortValue: SortValue;
  @Input() options: SortKey[] = [];

  constructor() { }
}
