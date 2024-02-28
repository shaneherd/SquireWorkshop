import {ListObject} from '../../list-object';
import {CreatureTurnPhase} from './creature-turn-phase.enum';
import {DamageConfigurationSimple} from '../../damage-configuration-simple';

export class CombatCondition {
  id: '0';
  condition: ListObject = null;
  name = '';
  endsOnSave = false;
  saveDc: number;
  saveType: ListObject = null;
  endsOnRoundsCount = false;
  numRounds: number;
  roundStarted: number;
  endsOnTargetTurn = false;
  targetCreatureId: '0';
  targetCreatureTurnPhase: CreatureTurnPhase;
  onGoingDamage = false;
  damages: DamageConfigurationSimple[] = [];
}
