import {SpeedType} from '../../speed-type.enum';
import {Creature} from '../../creatures/creature';
import {CombatCondition} from './combat-condition';
import {EncounterCreatureType} from './encounter-creature-type.enum';

export class BattleCreature {
  id = '0';
  encounterCreatureType: EncounterCreatureType;
  creature: Creature;
  creatureNumber = 1;
  initiative = 0;
  roundAdded = 1;
  speedToDisplay: SpeedType = SpeedType.WALK;
  actionReadied = false;
  surprised = false;
  conditions: CombatCondition[] = [];
  // actionStates: ActionState[] = [];
  removed = false;
  groupedInitiative = false;
  groupId = '0';
}
