import {RollResult} from './roll-result';
import {RollType} from './roll-type.enum';

export class Roll {
  id = '0';
  rollType = RollType.ATTACK;
  reason = '';
  halfOnMiss = false;
  advantage = false;
  disadvantage = false;
  critical = false;
  timestamp = 0;
  results: RollResult[] = [];
  totalResult = 0;
  childrenRolls: Roll[] = [];
}
