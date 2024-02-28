import {EncounterCharacter} from './encounter-character';
import {EncounterMonsterGroup} from './encounter-monster-group';
import {BattleCreature} from './battle-creature';
import {ListObject} from '../../list-object';

export class Encounter {
  id = '0';
  campaignId = '0';
  name = '';
  description = '';
  currentRound = 1;
  currentTurn = 1;
  startedAt: number;
  lastPlayedAt: number;
  finishedAt: number;
  expEarned = 0;
  customSort = false;
  hideKilled = true;

//   private EncounterSettings settings;
  encounterCharacters: EncounterCharacter[] = [];
  encounterMonsterGroups: EncounterMonsterGroup[] = [];
  battleCreatures: BattleCreature[] = [];
}

export class EncounterListObject extends ListObject {
  startedAt: number;
  lastPlayedAt: number;
  finishedAt: number;

  constructor(id: string = '0', name: string = '') {
    super(id, name);
  }
}

export class RoundTurn {
  round = 0;
  turn = 0;

  constructor(round: number, turn: number) {
    this.round = round;
    this.turn = turn;
  }
}
