import {Creature} from '../../../../shared/models/creatures/creature';
import {Roll} from '../../../../shared/models/rolls/roll';

export class RollResultDialogData {
  creature: Creature;
  roll: Roll;

  constructor(creature: Creature, roll: Roll) {
    this.creature = creature;
    this.roll = roll;
  }
}
