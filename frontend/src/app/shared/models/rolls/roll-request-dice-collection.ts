import {DamageType} from '../attributes/damage-type';
import {DiceSize} from '../dice-size.enum';

export class RollRequestDiceCollection {
  numDice = 0;
  diceSize: DiceSize;
  max = 0;
  modifier = 0;
  damageType: DamageType;
}
