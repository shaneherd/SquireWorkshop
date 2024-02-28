import {Component, Input} from '@angular/core';
import {CreatureListModifierValue} from '../../models/creatures/creature-list-modifier-value';
import {CreatureListProficiency} from '../../models/creatures/creature-list-proficiency';
import {CharacteristicType} from '../../models/characteristics/characteristic-type.enum';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-creature-choice-quantity',
  templateUrl: './creature-choice-quantity.component.html',
  styleUrls: ['./creature-choice-quantity.component.scss']
})
export class CreatureChoiceQuantityComponent {
  @Input() profs: CreatureListProficiency[];
  @Input() quantities: CreatureListModifierValue[] = [];

  constructor(
    private translate: TranslateService
  ) { }

  getTotal(): number {
    let total = 0;
    this.quantities.forEach((value: CreatureListModifierValue) => {
      total += value.value;
    });
    return total;
  }

  getQuantityChosen(): number {
    let quantity = 0;
    this.profs.forEach((prof: CreatureListProficiency) => {
      if (prof.inheritedFrom.length === 0 && prof.proficient && !this.parentChosen(prof.parentProficiency)) {
        quantity++;
      }
    });
    return quantity;
  }

  private parentChosen(parent: CreatureListProficiency): boolean {
    if (parent == null) {
      return false;
    }
    return parent.inheritedFrom.length > 0 || parent.proficient;
  }

  getTooltip(): string {
    const parts = [];
    this.quantities.forEach((value: CreatureListModifierValue) => {
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
    });
    return parts.join('\n');
  }

}
