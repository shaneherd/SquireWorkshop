import {Component, Input} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Treasure} from '../../../../shared/models/items/treasure';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-treasure-details',
  templateUrl: './treasure-details.component.html',
  styleUrls: ['./treasure-details.component.scss']
})
export class TreasureDetailsComponent {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() treasure: Treasure;

  constructor() { }

}
