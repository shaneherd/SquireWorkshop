import {RollRequestDiceCollection} from './roll-request-dice-collection';
import {RollType} from './roll-type.enum';

export class RollRequest {
  rollType = RollType.ATTACK;
  reason = '';
  halfOnMiss = false;
  advantage = false;
  disadvantage = false;
  diceCollections: RollRequestDiceCollection[] = [];
  //todo - add min value (i.e. min=1)
}
