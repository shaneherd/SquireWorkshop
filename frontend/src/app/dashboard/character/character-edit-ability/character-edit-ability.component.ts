import {Component, Input} from '@angular/core';
import {CreatureListModifierValue} from '../../../shared/models/creatures/creature-list-modifier-value';
import {CreatureListProficiency} from '../../../shared/models/creatures/creature-list-proficiency';
import {CreatureAbilityProficiency} from '../../../shared/models/creatures/configs/creature-ability-proficiency';
import {AbilityService} from '../../../core/services/attributes/ability.service';
import {ModifierService} from '../../../core/services/modifier.service';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {EventsService} from '../../../core/services/events.service';
import {EVENTS} from '../../../constants';
import {CreatureConfigurationCollection} from '../../../shared/models/creatures/configs/creature-configuration-collection';

@Component({
  selector: 'app-character-edit-ability',
  templateUrl: './character-edit-ability.component.html',
  styleUrls: ['./character-edit-ability.component.scss']
})
export class CharacterEditAbilityComponent {
  @Input() creatureAbilityProficiency: CreatureAbilityProficiency;
  @Input() abilitiesToIncreaseByOne: CreatureListProficiency[] = [];
  @Input() collection: CreatureConfigurationCollection;

  constructor(
    private creatureService: CreatureService,
    private abilityService: AbilityService,
    private modifierService: ModifierService,
    private eventsService: EventsService
  ) {
  }

  getInherited(): number {
    let quantity = 0;
    const modifier = this.creatureAbilityProficiency.abilityModifier;

    modifier.inheritedValues.forEach((value: CreatureListModifierValue) => {
      quantity += value.value;
    });
    this.abilitiesToIncreaseByOne.forEach((ability: CreatureListProficiency) => {
      if (ability.item.id === modifier.item.id && ability.proficient) {
        quantity++;
      }
    });
    quantity += this.abilityService.getMiscModifier(this.creatureAbilityProficiency);
    quantity += this.creatureService.getModifiers(this.creatureAbilityProficiency.scoreModifiers, this.collection);
    return quantity;
  }

  getTooltip(): string {
    return this.creatureService.getAbilityScoreTooltip(this.creatureAbilityProficiency, this.collection, false);
  }

  getTotal(): number {
    const score = this.creatureAbilityProficiency.abilityScore;
    return this.getInherited() + score.value;
  }

  valueChange(input): void {
    const score = this.creatureAbilityProficiency.abilityScore;
    score.value = parseInt(input.value, 10);
    this.eventsService.dispatchEvent(EVENTS.AbilityScoreChange);
  }

}
