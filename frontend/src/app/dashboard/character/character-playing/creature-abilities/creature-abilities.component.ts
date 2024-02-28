import {Component, Input} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureAbilityProficiency} from '../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-creature-abilities',
  templateUrl: './creature-abilities.component.html',
  styleUrls: ['./creature-abilities.component.scss']
})
export class CreatureAbilitiesComponent {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;

  configuringAbility: CreatureAbilityProficiency = null;
  configuringSave: CreatureAbilityProficiency = null;

  constructor() { }

  abilityClick(ability: CreatureAbilityProficiency): void {
    if (this.configuringAbility == null && this.configuringSave == null) {
      this.configuringAbility = ability;
    }
  }

  saveClick(ability: CreatureAbilityProficiency): void {
    if (this.configuringAbility == null && this.configuringSave == null) {
      this.configuringSave = ability;
    }
  }

  configurationClose(): void {
    this.configuringAbility = null;
    this.configuringSave = null;
  }
}
