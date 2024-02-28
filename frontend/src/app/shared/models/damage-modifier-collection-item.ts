import {ListObject} from './list-object';
import {DamageModifierType} from './characteristics/damage-modifier-type.enum';

export class DamageModifierCollectionItem {
  damageType: ListObject;
  damageModifierType: DamageModifierType = DamageModifierType.NORMAL;
  inheritedDamageModifierType: DamageModifierType = DamageModifierType.NORMAL;
}
