import {DiceSize} from '../dice-size.enum';
import {DamageType} from '../attributes/damage-type';

export class DiceResult {
  diceSize: DiceSize;
  damageType: DamageType;
  modifier = 0;
  results: number[] = [];
  totalResult = 0;
  critical = false;
}
