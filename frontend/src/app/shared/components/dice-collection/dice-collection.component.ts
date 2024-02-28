import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {DiceCollection} from '../../models/characteristics/dice-collection';
import {DiceSize} from '../../models/dice-size.enum';
import {ListObject} from '../../models/list-object';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-dice-collection',
  templateUrl: './dice-collection.component.html',
  styleUrls: ['./dice-collection.component.scss']
})
export class DiceCollectionComponent implements OnInit, OnChanges {
  private _parentDiceCollection: DiceCollection = new DiceCollection();
  get parentDiceCollection(): DiceCollection {
    return this._parentDiceCollection;
  }

  @Input() editing: boolean;
  @Input() loading: boolean;
  @Input() showDice = true;
  @Input() showAbility = true;
  @Input() diceCollection: DiceCollection;
  @Input()
  set parentDiceCollection(parentDiceCollection: DiceCollection) {
    if (parentDiceCollection !== this.parentDiceCollection) {
      if (parentDiceCollection == null ) {
        this._parentDiceCollection = new DiceCollection();
      } else {
        this._parentDiceCollection = parentDiceCollection;
      }
    }
  }
  @Input() diceSizes: DiceSize[] = [];
  @Input() abilities: ListObject[] = [];

  noAbility: string;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.noAbility = this.translate.instant('None');
  }

  ngOnChanges(changes: SimpleChanges) {
    const parentDiceCollection: SimpleChange = changes.parentDiceCollection;
    if (parentDiceCollection != null && parentDiceCollection.currentValue == null) {
      parentDiceCollection.currentValue = new DiceCollection();
    }
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
