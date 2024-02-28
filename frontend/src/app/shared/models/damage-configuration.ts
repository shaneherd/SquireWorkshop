import {DiceCollection} from './characteristics/dice-collection';
import {DamageType} from './attributes/damage-type';
import {ListObject} from './list-object';

export class DamageConfiguration {
  characterAdvancement = false;
  extra = false;
  level: ListObject;
  values: DiceCollection = new DiceCollection();
  damageType: DamageType;
  healing = false;
  versatile = false;
  spellCastingAbilityModifier = false;
  adjustment = true;
}
