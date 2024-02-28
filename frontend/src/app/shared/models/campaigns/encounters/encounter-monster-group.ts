import {HealthCalculationType} from '../../creatures/characters/health-calculation-type.enum';
import {EncounterMonster} from './encounter-monster';
import {MonsterSummary} from '../../creatures/monsters/monster-summary';

export class EncounterMonsterGroup {
  id = '0';
  groupNumber = 0;
  displayName = '';
  monster: MonsterSummary;
  quantity = 1; //todo - remove
  healthCalculationType: HealthCalculationType = HealthCalculationType.AVERAGE;
  groupedHp = true;
  groupedInitiative = true;
  monsters: EncounterMonster[] = [];
  order = 0;
}
