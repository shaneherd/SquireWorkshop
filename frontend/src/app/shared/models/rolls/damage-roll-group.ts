import {DamageType} from '../attributes/damage-type';
import {DiceResult} from './dice-result';

export class DamageRollGroup {
  damageType: DamageType;
  results: DiceResult[] = [];
  totalResult = 0;
}
