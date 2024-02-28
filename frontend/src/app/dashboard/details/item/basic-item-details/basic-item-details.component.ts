import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {Item} from '../../../../shared/models/items/item';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-basic-item-details',
  templateUrl: './basic-item-details.component.html',
  styleUrls: ['./basic-item-details.component.scss']
})
export class BasicItemDetailsComponent {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() item: Item;
  @Input() type = '';
  @Input() typeDescription = '';
  @Output() itemClick = new EventEmitter();

  constructor() { }

  onItemClick(creatureItem: CreatureItem): void {
    this.itemClick.emit(creatureItem);
  }

}
