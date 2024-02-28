import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreatureWealthAmountAdjustment} from '../../../dashboard/character/character-playing/creature-wealth/creature-wealth.component';

@Component({
  selector: 'app-adjustment-card-row',
  templateUrl: './adjustment-card-row.component.html',
  styleUrls: ['./adjustment-card-row.component.scss']
})
export class AdjustmentCardRowComponent {
  @Input() adjustment: CreatureWealthAmountAdjustment;
  @Input() clickDisabled = true;
  @Input() showBadge = true;
  @Input() showInput = true;
  @Output() cardClick = new EventEmitter<any>();
  MAX_ADJUSTMENT_AMOUNT = 99999;

  constructor() { }

  onCardClick(): void {
    this.cardClick.emit();
  }

  amountChange(input): void {
    this.adjustment.amount = parseInt(input.value, 10);
  }

}
