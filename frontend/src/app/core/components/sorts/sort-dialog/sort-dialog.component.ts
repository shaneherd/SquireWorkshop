import {Component, Input, OnInit} from '@angular/core';
import {SortDialogData} from '../sort-dialog-data';
import {SortValue} from '../sort-value';
import {SortKey} from '../sort-key.enum';
import {MatDialogRef} from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
  selector: 'app-sort-dialog',
  templateUrl: './sort-dialog.component.html',
  styleUrls: ['./sort-dialog.component.scss']
})
export class SortDialogComponent implements OnInit {
  @Input() dialogRef: MatDialogRef<any>;
  @Input() data: SortDialogData;
  @Input() options: SortKey[];
  @Input() defaultKey: SortKey;
  @Input() defaultOption: boolean;

  sortValue: SortValue;

  constructor(
  ) {
  }

  ngOnInit() {
    this.initializeSorts();
  }

  initializeSorts(): void {
    if (this.data.sorts.sortValues.length === 0) {
      this.sortValue = this.getSortValue(this.defaultKey, this.defaultOption);
    } else {
      this.sortValue = _.cloneDeep(this.data.sorts.sortValues[0]);
    }

    this.initializeSelectedValues();
  }

  private initializeSelectedValues(): void {
    if (this.data.sorts.sortValues.length > 0) {
      this.sortValue = this.data.sorts.sortValues[0];
    }
  }

  private getSortValue(sortKey: SortKey, value: boolean): SortValue {
    const sortValue = new SortValue();
    sortValue.sortKey = sortKey;
    sortValue.ascending = value;
    return sortValue;
  }

  private setSorts(): void {
    const sorts: SortValue[] = [];
    sorts.push(this.sortValue);
    this.data.sorts.sortValues = sorts;
  }

  apply(): void {
    this.setSorts();
    this.data.apply(this.data.sorts);
    this.dialogRef.close();
  }

  private clearSorts(): void {
    this.sortValue.sortKey = this.defaultKey;
    this.sortValue.ascending = this.defaultOption;
  }

  clear(): void {
    this.clearSorts();
    this.setSorts();
    this.data.clear();
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
