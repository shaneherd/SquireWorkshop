import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Gear} from '../../../../shared/models/items/gear';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-gear-details',
  templateUrl: './gear-details.component.html',
  styleUrls: ['./gear-details.component.scss']
})
export class GearDetailsComponent {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() gear: Gear;
  @Output() itemClick = new EventEmitter();

  constructor() { }

  onItemClick(creatureItem: CreatureItem): void {
    this.itemClick.emit(creatureItem);
  }

}
