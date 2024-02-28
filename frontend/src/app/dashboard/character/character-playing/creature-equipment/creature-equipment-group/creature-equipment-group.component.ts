import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureItem} from '../../../../../shared/models/creatures/creature-item';
import {EquipmentGroup} from '../../../../../constants';
import {MagicalItemSpellConfiguration} from '../../../../../shared/models/items/magical-item-spell-configuration';
import {Creature} from '../../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-creature-equipment-group',
  templateUrl: './creature-equipment-group.component.html',
  styleUrls: ['./creature-equipment-group.component.scss']
})
export class CreatureEquipmentGroupComponent {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() items: CreatureItem[] = [];
  @Input() itemGrouping: EquipmentGroup;
  @Input() showEmpty = false;
  @Input() clickDisabled = false;
  @Output() itemClick = new EventEmitter<CreatureItem>();
  @Output() spellClick = new EventEmitter<MagicalItemSpellConfiguration>();

  constructor() { }

  onItemClick(creatureItem: CreatureItem): void {
    if (!this.clickDisabled) {
      this.itemClick.emit(creatureItem);
    }
  }

  onSpellClick(config: MagicalItemSpellConfiguration): void {
    if (!this.clickDisabled) {
      this.spellClick.emit(config);
    }
  }

}
