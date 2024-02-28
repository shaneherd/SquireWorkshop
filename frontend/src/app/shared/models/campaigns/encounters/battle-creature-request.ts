import {EncounterCharacter} from './encounter-character';
import {EncounterMonsterGroup} from './encounter-monster-group';

export class BattleCreatureRequest {
  characters: EncounterCharacter[] = [];
  groups: EncounterMonsterGroup[] = [];
}
