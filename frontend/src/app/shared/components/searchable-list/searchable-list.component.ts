import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UtilService} from '../../../core/services/util.service';

@Component({
  selector: 'app-searchable-list',
  templateUrl: './searchable-list.component.html',
  styleUrls: ['./searchable-list.component.scss']
})
export class SearchableListComponent implements OnInit {
  @Input() searchable = false;
  @Input() filterable = false;
  @Input() searchValue = '';
  @Output() searchValueChange = new EventEmitter();
  @Output() searchClick = new EventEmitter();
  @Output() filterClick = new EventEmitter();

  debouncedSearch: () => void;

  constructor(
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.debouncedSearch = this.utilService.debounce(() => {
      this.onSearchClick();
    }, 200);
  }

  keypress(event: KeyboardEvent): void {
    if (event.key.toLowerCase() === 'enter') {
      this.onSearchClick();
    }
  }

  onSearchValueChange(): void {
    this.searchValueChange.emit(this.searchValue);
    this.debouncedSearch();
  }

  onSearchClick(): void {
    this.searchClick.emit();
  }

  onFilterClick(): void {
    this.filterClick.emit();
  }

}
