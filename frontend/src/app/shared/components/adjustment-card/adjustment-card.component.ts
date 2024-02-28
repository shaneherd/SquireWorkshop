import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-adjustment-card',
  templateUrl: './adjustment-card.component.html',
  styleUrls: ['./adjustment-card.component.scss']
})
export class AdjustmentCardComponent {
  @Input() quantity = 0;
  @Input() adjustment = 0;
  @Input() label = '';
  @Input() clickDisabled = false;
  @Input() showBadge = true;
  @Output() cardClick = new EventEmitter();

  constructor() { }

  onClick(): void {
    if (!this.clickDisabled) {
      this.cardClick.emit();
    }
  }

}
