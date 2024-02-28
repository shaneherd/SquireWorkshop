import {Item} from './item';
import {WeaponType} from './weapon-type';
import {WeaponRangeType} from './weapon-range-type.enum';
import {WeaponProperty} from '../attributes/weapon-property';
import {DamageConfiguration} from '../damage-configuration';
import {ItemType} from './item-type.enum';
import {ListObject} from '../list-object';
import {ItemTypeValue} from '../../../constants';

export class Weapon extends Item {
  type: ItemTypeValue = 'Weapon';
  itemType: ItemType = ItemType.WEAPON;
  weaponType: WeaponType;
  rangeType: WeaponRangeType = WeaponRangeType.MELEE;
  normalRange = 0;
  longRange = 0;
  attackMod = 0;
  properties: WeaponProperty[] = [];
  damages: DamageConfiguration[] = [];
  versatileDamages: DamageConfiguration[] = [];
  ammoType: ListObject;
}
