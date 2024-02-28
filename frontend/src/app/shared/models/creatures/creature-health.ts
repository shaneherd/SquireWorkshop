import {CreatureState} from './creature-state.enum';
import {CreatureHitDice} from './creature-hit-dice';

export class CreatureHealth {
  currentHp = 0;
  tempHp = 0;
  maxHpMod = 0;
  creatureHitDice: CreatureHitDice[] = [];
  numDeathSaveThrowSuccesses = 0;
  numDeathSaveThrowFailures = 0;
  deathSaveMod = 0;
  deathSaveAdvantage = false;
  deathSaveDisadvantage = false;
  resurrectionPenalty = 0;
  creatureState: CreatureState = CreatureState.CONSCIOUS;
  exhaustionLevel = 0;
}
