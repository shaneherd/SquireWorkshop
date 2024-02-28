import {DiceCollection} from './characteristics/dice-collection';
import {ListObject} from './list-object';

export class DamageConfigurationSimple {
  values: DiceCollection = new DiceCollection();
  damageType: ListObject;
}
