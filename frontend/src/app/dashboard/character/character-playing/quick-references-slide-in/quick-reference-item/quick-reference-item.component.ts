import {Component, Input, Output, EventEmitter} from '@angular/core';
import {QuickReference} from '../quick-references-slide-in.component';

@Component({
  selector: 'app-quick-reference-item',
  templateUrl: './quick-reference-item.component.html',
  styleUrls: ['./quick-reference-item.component.scss']
})
export class QuickReferenceItemComponent {
  @Input() quickReference: QuickReference;
  @Output() close = new EventEmitter<QuickReference>();

  constructor() { }

  expandChange(expanded: boolean): void {
    this.quickReference.initialized = true;
    if (!expanded) {
      this.close.emit(this.quickReference);
    }
  }

  closeEvent(quickReference: QuickReference): void {
    this.close.emit(quickReference);
  }

}
