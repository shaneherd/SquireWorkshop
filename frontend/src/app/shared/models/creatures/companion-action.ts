import {MonsterAction} from './monsters/monster';
import {CreaturePower} from './creature-power';

export class CompanionAction extends CreaturePower {
  monsterAction: MonsterAction;
}
