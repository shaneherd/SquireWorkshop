import {Item} from './item';
import {Ability} from '../attributes/ability.model';
import {DamageConfiguration} from '../damage-configuration';
import {ItemType} from './item-type.enum';
import {ItemTypeValue} from '../../../constants';

export class Ammo extends Item {
  type: ItemTypeValue = 'Ammo';
  itemType: ItemType = ItemType.AMMO;
  attackModifier = 0;
  attackAbilityModifier: Ability = null;
  damages: DamageConfiguration[] = [];
}
