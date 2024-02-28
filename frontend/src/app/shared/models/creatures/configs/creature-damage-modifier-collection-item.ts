import {ListObject} from '../../list-object';
import {DamageModifierType} from '../../characteristics/damage-modifier-type.enum';
import {InheritedDamageModifierType} from './inherited-damage-modifier-type';
import {PowerModifierConfiguration} from '../../power-modifier-configuration';

export class CreatureDamageModifierCollectionItem {
  damageType: ListObject;
  damageModifierType: DamageModifierType;
  inheritedDamageModifierTypes: InheritedDamageModifierType[] = [];
  modifiers = new Map<string, PowerModifierConfiguration>();
}
