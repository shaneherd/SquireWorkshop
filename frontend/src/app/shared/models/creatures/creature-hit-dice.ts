import {DiceSize} from '../dice-size.enum';

export class CreatureHitDice {
  diceSize: DiceSize = DiceSize.ONE;
  remaining = 0;
}
