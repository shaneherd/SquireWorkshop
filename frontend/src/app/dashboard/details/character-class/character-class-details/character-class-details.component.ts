import {Component, Input, OnInit} from '@angular/core';
import {CharacterClass} from '../../../../shared/models/characteristics/character-class';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {ListObject} from '../../../../shared/models/list-object';
import {AbilityService} from '../../../../core/services/attributes/ability.service';

@Component({
  selector: 'app-character-class-details',
  templateUrl: './character-class-details.component.html',
  styleUrls: ['./character-class-details.component.scss']
})
export class CharacterClassDetailsComponent implements OnInit {
  @Input() characterClass: CharacterClass;
  diceSizes: DiceSize[] = [];
  abilities: ListObject[] = [];

  constructor(
    private abilityService: AbilityService
  ) { }

  ngOnInit() {
    this.initializeDiceSizes();
    this.initializeAbilities();
  }

  private initializeDiceSizes(): void {
    this.diceSizes = [];
    this.diceSizes.push(DiceSize.ONE);
    this.diceSizes.push(DiceSize.TWO);
    this.diceSizes.push(DiceSize.THREE);
    this.diceSizes.push(DiceSize.FOUR);
    this.diceSizes.push(DiceSize.SIX);
    this.diceSizes.push(DiceSize.EIGHT);
    this.diceSizes.push(DiceSize.TEN);
    this.diceSizes.push(DiceSize.TWELVE);
    this.diceSizes.push(DiceSize.TWENTY);
    this.diceSizes.push(DiceSize.HUNDRED);
  }

  private initializeAbilities(): void {
    this.abilities = [];
    this.abilityService.getAbilities().then().then((abilities: ListObject[]) => {
      abilities = abilities.slice(0);
      const noAbility = new ListObject('0', '');
      abilities.unshift(noAbility);
      this.abilities = abilities;
    });
  }

}
