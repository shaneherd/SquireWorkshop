import {Component, Input} from '@angular/core';
import {CreatureWealthAmount} from '../../models/creatures/creature-wealth-amount';

@Component({
  selector: 'app-character-wealth-item',
  templateUrl: './creature-wealth-item.component.html',
  styleUrls: ['./creature-wealth-item.component.scss']
})
export class CreatureWealthItemComponent {
  @Input() creatureWealthAmount: CreatureWealthAmount;

  constructor() { }

}
