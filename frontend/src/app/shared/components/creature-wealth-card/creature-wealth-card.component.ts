import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreatureWealthAmount} from '../../models/creatures/creature-wealth-amount';

@Component({
  selector: 'app-creature-wealth-card',
  templateUrl: './creature-wealth-card.component.html',
  styleUrls: ['./creature-wealth-card.component.scss']
})
export class CreatureWealthCardComponent {
  @Input() creatureWealthAmount: CreatureWealthAmount;
  @Input() clickDisabled = false;
  @Input() displayTags = false;
  @Output() wealthClick = new EventEmitter();

  constructor() { }

  onWealthClick(): void {
    if (!this.clickDisabled) {
      this.wealthClick.emit(this.creatureWealthAmount);
    }
  }

}
