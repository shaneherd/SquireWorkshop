import {Roll} from '../../rolls/roll';
import {EncounterCreature} from './encounter-creature';

export class EncounterMonster extends EncounterCreature {
  monsterNumber: number;
  hp = 0;
  initiativeTooltip = ''; //todo - remove
  stealthRoll: Roll = new Roll(); //todo - remove
  stealthRollTooltip = ''; //todo - remove
}
