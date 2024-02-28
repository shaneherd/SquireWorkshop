import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-selection-list-slide-in',
  templateUrl: './selection-list-slide-in.component.html',
  styleUrls: ['./selection-list-slide-in.component.scss']
})
export class SelectionListSlideInComponent {
  @Input() searchable = false;
  @Input() filterable = false;
  @Input() loading = false;
  @Input() headerName: string;
  @Input() allowSelectAll = false;
  @Input() selectedCount = 0;
  @Input() availableCount = -1;
  @Output() add = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() selectAll = new EventEmitter();
  @Output() filter = new EventEmitter();
  @Output() search = new EventEmitter();

  searchValue = '';

  constructor() { }

  searchChange(): void {
    const value = this.searchValue.trim().toLowerCase();
    this.search.emit(value);
  }

  filterClick(): void {
    this.filter.emit();
  }

  addSelected(): void {
    this.add.emit();
  }

  closeClick(): void {
    this.close.emit();
  }

  selectAllClick(): void {
    this.selectAll.emit();
  }

}
