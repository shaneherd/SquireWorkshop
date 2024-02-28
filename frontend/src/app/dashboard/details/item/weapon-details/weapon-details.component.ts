import {Component, Input, OnInit} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Weapon} from '../../../../shared/models/items/weapon';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {WeaponRangeType} from '../../../../shared/models/items/weapon-range-type.enum';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-weapon-details',
  templateUrl: './weapon-details.component.html',
  styleUrls: ['./weapon-details.component.scss']
})
export class WeaponDetailsComponent implements OnInit {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() weapon: Weapon;

  ranged = false;

  constructor(
  ) { }

  ngOnInit() {
    this.ranged = this.weapon.rangeType === WeaponRangeType.RANGED;
  }
}
