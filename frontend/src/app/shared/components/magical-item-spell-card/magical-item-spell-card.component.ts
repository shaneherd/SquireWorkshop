import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MagicalItemSpellConfiguration} from '../../models/items/magical-item-spell-configuration';
import {MagicalItem} from '../../models/items/magical-item';
import {Creature} from '../../models/creatures/creature';

@Component({
  selector: 'app-magical-item-spell-card',
  templateUrl: './magical-item-spell-card.component.html',
  styleUrls: ['./magical-item-spell-card.component.scss']
})
export class MagicalItemSpellCardComponent {
  @Input() creature: Creature;
  @Input() magicalItem: MagicalItem;
  @Input() config: MagicalItemSpellConfiguration;
  @Input() disabled = false;
  @Output() click = new EventEmitter<MagicalItemSpellConfiguration>();

  constructor() { }

  spellClick(): void {
    this.click.emit(this.config);
  }

}
