import {Component, Input} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Pack} from '../../../../shared/models/items/pack';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {Creature} from '../../../../shared/models/creatures/creature';
import {ItemQuantity} from '../../../../shared/models/items/item-quantity';
import {SelectionItem} from '../../../../shared/models/items/selection-item';

@Component({
  selector: 'app-pack-details',
  templateUrl: './pack-details.component.html',
  styleUrls: ['./pack-details.component.scss']
})
export class PackDetailsComponent {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() pack: Pack;
  @Input() disabled = false;

  viewingItem: SelectionItem = null;

  constructor() { }

  onItemClick(itemQuantity: ItemQuantity): void {
    if (!this.disabled) {
      this.viewingItem = new SelectionItem();
      this.viewingItem.item = itemQuantity.item;
    }
  }

  closeItem(): void {
    this.viewingItem = null;
  }

}
