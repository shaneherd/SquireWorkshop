import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MonsterAction} from '../../../../../shared/models/creatures/monsters/monster';

@Component({
  selector: 'app-monster-action-card',
  templateUrl: './monster-action-card.component.html',
  styleUrls: ['./monster-action-card.component.scss']
})
export class MonsterActionCardComponent {
  @Input() action: MonsterAction;
  @Input() clickDisabled = false;
  @Output() actionClick = new EventEmitter<MonsterAction>();

  constructor() { }

  onActionClick(): void {
    this.actionClick.emit(this.action);
  }

}
