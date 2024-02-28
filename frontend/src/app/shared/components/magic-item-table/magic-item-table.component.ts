import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MagicalItemTable, MagicalItemTableRow} from '../../models/items/magical-item-table';

export class CellClickEvent {
  row: MagicalItemTableRow;
  index: number;
}

@Component({
  selector: 'app-magic-item-table',
  templateUrl: './magic-item-table.component.html',
  styleUrls: ['./magic-item-table.component.scss']
})
export class MagicItemTableComponent {
  @Input() table: MagicalItemTable;
  @Input() showName = true;
  @Input() clickable = false;
  @Input() fullWidth = false;
  @Input() class = '';
  @Output() headerClick = new EventEmitter<number>();
  @Output() cellClick = new EventEmitter<CellClickEvent>();

  constructor() { }

  onCellClick(row: MagicalItemTableRow, index: number): void {
    if (this.clickable) {
      const event = new CellClickEvent();
      event.row = row;
      event.index = index;
      this.cellClick.emit(event);
    }
  }

  onHeaderClick(index: number): void {
    if (this.clickable) {
      this.headerClick.emit(index);
    }
  }

}
