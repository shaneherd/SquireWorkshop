import {CreatureHealth} from '../creature-health';
import {ChosenClass} from './chosen-class';
import {HealthCalculationType} from './health-calculation-type.enum';

export class CharacterHealthConfiguration {
  creatureHealth: CreatureHealth;
  hpGainModifier = 0;
  healthCalculationType: HealthCalculationType = HealthCalculationType.ROLL;
  classes: ChosenClass[];
}
