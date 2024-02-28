import {Component, Input} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Ammo} from '../../../../shared/models/items/ammo';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-ammo-details',
  templateUrl: './ammo-details.component.html',
  styleUrls: ['./ammo-details.component.scss']
})
export class AmmoDetailsComponent {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() ammo: Ammo;

  constructor() { }

}
