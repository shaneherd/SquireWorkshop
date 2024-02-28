import {Ability} from '../attributes/ability.model';
import {DiceSize} from '../dice-size.enum';

export class DiceCollection {
  numDice = 0;
  diceSize = DiceSize.ONE;
  abilityModifier = new Ability();
  miscModifier = 0;

  constructor(diceSize = DiceSize.ONE) {
    this.diceSize = diceSize;
    this.numDice = 0;
    this.abilityModifier = new Ability();
    this.miscModifier = 0;
  }
}
