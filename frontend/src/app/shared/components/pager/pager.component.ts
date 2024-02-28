import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnChanges {
  @Input() pageCount = 0;
  @Input() index = 0;
  @Output() pageChange = new EventEmitter();

  progress = 0;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        if (propName === 'index') {
          this.updateProgress();
        }
      }
    }
  }

  onNextPage(): void {
    if (this.index < this.pageCount - 1) {
      this.pageChange.emit(this.index + 1);
    }
  }

  onPreviousPage(): void {
    if (this.index === 0) {
      return;
    }
    this.pageChange.emit(this.index - 1);
  }

  private updateProgress(): void {
    this.progress = (this.index + 1) / this.pageCount * 100;
  }

}
