import {Component, Input} from '@angular/core';
import {ChosenClass} from '../../../shared/models/creatures/characters/chosen-class';
import {DiceSize} from '../../../shared/models/dice-size.enum';

@Component({
  selector: 'app-character-edit-health-hit-dice',
  templateUrl: './character-edit-health-hit-dice.component.html',
  styleUrls: ['./character-edit-health-hit-dice.component.scss']
})
export class CharacterEditHealthHitDiceComponent {
  @Input() chosenClass: ChosenClass;
  @Input() numLevels = 0;

  constructor() { }

  getHitDiceSize(): DiceSize {
    if (this.chosenClass.characterClass == null) {
      return DiceSize.ONE;
    }
    return this.chosenClass.characterClass.hitDice.diceSize;
  }

}
