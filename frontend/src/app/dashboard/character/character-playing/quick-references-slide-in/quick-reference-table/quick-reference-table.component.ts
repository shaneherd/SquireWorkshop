import {Component, Input} from '@angular/core';
import {QuickReferenceTable} from '../quick-references-slide-in.component';

@Component({
  selector: 'app-quick-reference-table',
  templateUrl: './quick-reference-table.component.html',
  styleUrls: ['./quick-reference-table.component.scss']
})
export class QuickReferenceTableComponent {
  @Input() table: QuickReferenceTable;

  constructor() { }
}
