import {Component, Input} from '@angular/core';
import {CreatureListModifierValue} from '../../../shared/models/creatures/creature-list-modifier-value';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {CreatureListProficiency} from '../../../shared/models/creatures/creature-list-proficiency';
import {CreatureProficiencyCollection} from '../../../shared/models/creatures/configs/creature-proficiency-collection';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-character-edit-abilities',
  templateUrl: './character-edit-abilities.component.html',
  styleUrls: ['./character-edit-abilities.component.scss']
})
export class CharacterEditAbilitiesComponent {
  @Input() collection: CreatureProficiencyCollection = new CreatureProficiencyCollection();

  constructor(
    private translate: TranslateService
  ) { }

  getTotalAbilitiesToIncreaseByOne(): number {
    let total = 0;
    this.collection.numAbilities.forEach((value: CreatureListModifierValue) => {
      total += value.value;
    });
    return total;
  }

  getTotalAbilitiesToIncreaseByOneTooltip(): string {
    const parts = [];
    this.collection.numAbilities.forEach((value: CreatureListModifierValue) => {
      if (value.value > 0) {
        let prefix = '';
        switch (value.inheritedFrom.type) {
          case CharacteristicType.BACKGROUND:
            prefix = this.translate.instant('Labels.Background') + ' ';
            break;
          case CharacteristicType.CLASS:
            prefix = this.translate.instant('Labels.Class') + ' ';
            break;
          case CharacteristicType.RACE:
            prefix = this.translate.instant('Labels.Race') + ' ';
            break;
        }
        parts.push(prefix + value.inheritedFrom.name + ': ' + value.value);
      }
    });
    return parts.join('\n');
  }

  getQuantityChosen(): number {
    let quantity = 0;
    this.collection.abilityProficiencies.forEach((ability: CreatureListProficiency) => {
      if (ability.proficient) {
        quantity++;
      }
    });
    return quantity;
  }

}
