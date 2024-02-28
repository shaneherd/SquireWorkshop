import {Creature} from '../creature';
import {Monster} from '../monsters/monster';
import {BattleMonsterFeature} from '../battle-monster-feature';
import {BattleMonsterSettings} from '../characters/character-settings';
import {BattleMonsterAction} from '../battle-monster-action';

export class BattleMonster extends Creature {
  type = 'BattleMonster';
  monsterId = '0';
  monster: Monster;
  maxHp: number;
  features: BattleMonsterFeature[] = [];
  actions: BattleMonsterAction[] = [];
  settings: BattleMonsterSettings = new BattleMonsterSettings();
  legendaryPoints = 0;
  maxLegendaryPoints = 0;
}
