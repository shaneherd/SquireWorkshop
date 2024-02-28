import {DiceSize} from '../dice-size.enum';
import {Roll} from '../rolls/roll';

export class CreatureHitDiceModification {
  diceSize: DiceSize = DiceSize.ONE;
  remaining = 0;
  max = 0;
  maxTooltip = '';
  results: Roll[] = [];
}
