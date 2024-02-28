import {CreaturePower} from './creature-power';
import {Action} from '../action.enum';

export class BattleMonsterPower extends CreaturePower {
  rechargeMin = 0;
  rechargeMax = 0;
}

export class BattleMonsterAction extends BattleMonsterPower {
  actionType: Action;
  legendaryCost = 0;
}
