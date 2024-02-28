import {Component, Input, OnInit} from '@angular/core';
import {DiceCollection} from '../../../../shared/models/characteristics/dice-collection';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {ListObject} from '../../../../shared/models/list-object';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-monster-hp-calculation',
  templateUrl: './monster-hp-calculation.component.html',
  styleUrls: ['./monster-hp-calculation.component.scss']
})
export class MonsterHpCalculationComponent implements OnInit {
  @Input() editing: boolean;
  @Input() loading: boolean;
  @Input() diceCollection: DiceCollection;
  @Input() diceSizes: DiceSize[] = [];
  @Input() abilities: ListObject[] = [];

  noAbility: string;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.noAbility = this.translate.instant('None');
  }

  numDiceChange(input): void {
    this.diceCollection.numDice = parseInt(input.value, 10);
  }

  diceSizeChange(diceSize: DiceSize): void {
    this.diceCollection.diceSize = diceSize;
  }

  miscModifierChange(input): void {
    this.diceCollection.miscModifier = parseInt(input.value, 10);
  }

  abilityModifierChange(abilityId: string): void {
    const ability = this.getAbility(abilityId);
    this.diceCollection.abilityModifier.id = ability.id;
    this.diceCollection.abilityModifier.name = ability.name;
  }

  getAbility(id: string): ListObject {
    for (let i = 0; i < this.abilities.length; i++) {
      const ability: ListObject = this.abilities[i];
      if (ability.id === id) {
        return ability;
      }
    }
    return new ListObject('0', '');
  }

}
