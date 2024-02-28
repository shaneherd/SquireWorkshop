import {Component, Input} from '@angular/core';
import {CharacteristicType} from '../../models/characteristics/characteristic-type.enum';
import {CreatureListProficiency} from '../../models/creatures/creature-list-proficiency';
import {InheritedFrom} from '../../models/creatures/inherited-from';
import {TranslateService} from '@ngx-translate/core';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-creature-proficiency',
  templateUrl: './creature-proficiency.component.html',
  styleUrls: ['./creature-proficiency.component.scss']
})
export class CreatureProficiencyComponent {
  @Input() prof: CreatureListProficiency;

  constructor(
    private translate: TranslateService
  ) { }

  profChange(event: MatCheckboxChange): void {
    if (!this.isDisabled()) {
      this.prof.proficient = event.checked;
    }
  }

  isChecked(prof: CreatureListProficiency): boolean {
    if (prof.proficient || prof.inheritedFrom.length > 0) {
      return true;
    }
    if (prof.parentProficiency != null) {
      return this.isChecked(prof.parentProficiency);
    }
    return false;
  }

  isDisabled(): boolean {
    if (this.prof.inheritedFrom.length > 0) {
      return true;
    }
    if (this.prof.parentProficiency != null) {
      return this.isChecked(this.prof.parentProficiency);
    }
  }

  getTooltip(): string {
    const parts = [];
    this.prof.inheritedFrom.forEach((inheritedFrom: InheritedFrom) => {
      switch (inheritedFrom.type) {
        case CharacteristicType.BACKGROUND:
          parts.push(this.translate.instant('Labels.Background') + ' ' + inheritedFrom.name);
          break;
        case CharacteristicType.CLASS:
          parts.push(this.translate.instant('Labels.Class') + ' ' + inheritedFrom.name);
          break;
        case CharacteristicType.RACE:
          parts.push(this.translate.instant('Labels.Race') + ' ' + inheritedFrom.name);
          break;
      }
    });
    return parts.join('\n');
  }

}
