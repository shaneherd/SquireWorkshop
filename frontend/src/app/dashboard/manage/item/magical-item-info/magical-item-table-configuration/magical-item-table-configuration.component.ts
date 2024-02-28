import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MagicalItemTable, MagicalItemTableRow} from '../../../../../shared/models/items/magical-item-table';
import * as _ from 'lodash';
import {CellClickEvent} from '../../../../../shared/components/magic-item-table/magic-item-table.component';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-magical-item-table-configuration',
  templateUrl: './magical-item-table-configuration.component.html',
  styleUrls: ['./magical-item-table-configuration.component.scss']
})
export class MagicalItemTableConfigurationComponent implements OnInit {
  @Input() magicalItemTable: MagicalItemTable;
  @Output() close = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() continue = new EventEmitter<MagicalItemTable>();

  loading = false;
  viewingCell: string = null;
  viewingIndex = -1;
  viewingHeader = false;
  viewingRow: MagicalItemTableRow = null;

  editingTable: MagicalItemTable;
  defaultValue = '';
  MAX_COLUMNS = 5;

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.editingTable = _.cloneDeep(this.magicalItemTable);
    this.defaultValue = this.translate.instant('ClickToEdit');
  }

  cancelClick(): void {
    this.close.emit();
  }

  continueClick(): void {
    //todo - verify no missing data
    if (this.isTableValid()) {
      this.continue.emit(this.editingTable);
    } else {
      this.notificationService.error(this.translate.instant('MagicalItemTable.NotAllValuesSet'));
    }
  }

  removeClick(): void {
    this.remove.emit();
  }

  private isTableValid(): boolean {
    for (let i = 0; i < this.editingTable.columns.length; i++) {
      const headerValue = this.editingTable.columns[i];
      if (headerValue === this.defaultValue || headerValue === '') {
        return false;
      }
    }

    for (let j = 0; j < this.editingTable.rows.length; j++) {
      const row = this.editingTable.rows[j];
      for (let k = 0; k < row.values.length; k++) {
        const cellValue = row.values[k];
        if (cellValue === this.defaultValue || cellValue === '') {
          return false;
        }
      }
    }
    return true;
  }

  headerClick(index: number): void {
    this.viewingCell = this.editingTable.columns[index];
    this.viewingIndex = index;
    this.viewingHeader = true;
  }

  cellClick(event: CellClickEvent): void {
    this.viewingRow = event.row;
    this.viewingCell = event.row.values[event.index];
    this.viewingIndex = event.index;
    this.viewingHeader = false;
  }

  saveCell(value: string): void {
    if (this.viewingHeader) {
      this.editingTable.columns[this.viewingIndex] = value;
    } else {
      this.viewingRow.values[this.viewingIndex] = value;
    }

    this.viewingRow = null;
    this.viewingCell = null;
    this.viewingIndex = -1;
  }

  removeCell(): void {
    if (this.viewingHeader) {
      //remove column
      this.editingTable.columns.splice(this.viewingIndex, 1);
      this.editingTable.rows.forEach((row: MagicalItemTableRow) => {
        row.values.splice(this.viewingIndex, 1);
      });
    } else {
      //remove row
      const rowIndex = this.editingTable.rows.indexOf(this.viewingRow);
      if (rowIndex !== -1) {
        this.editingTable.rows.splice(rowIndex, 1);
      }
    }

    this.viewingRow = null;
    this.viewingCell = null;
    this.viewingIndex = -1;
  }

  cancelEditCell(): void {
    this.viewingRow = null;
    this.viewingCell = null;
    this.viewingIndex = -1;
  }

  addColumn(): void {
    if (this.editingTable.columns.length < this.MAX_COLUMNS) {
      this.editingTable.columns.push(this.defaultValue);
      this.editingTable.rows.forEach((row: MagicalItemTableRow) => {
        row.values.push(this.defaultValue);
      });
    }
  }

  addRow(): void {
    const row = new MagicalItemTableRow();
    row.values = [];
    for (let i = 0; i < this.editingTable.columns.length; i++) {
      row.values.push(this.defaultValue);
    }
    this.editingTable.rows.push(row);
  }
}
