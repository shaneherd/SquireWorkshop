import {Component, Input} from '@angular/core';
import {ListProficiency} from '../../models/list-proficiency';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-proficiency-list',
  templateUrl: './proficiency-list.component.html',
  styleUrls: ['./proficiency-list.component.scss']
})
export class ProficiencyListComponent {
  @Input() proficiencies: ListProficiency[];
  @Input() editing: boolean;
  @Input() showSecondary: boolean;

  constructor() { }

  hasProficiencies(): boolean {
    for (let i = 0; i < this.proficiencies.length; i++) {
      const prof: ListProficiency = this.proficiencies[i];
      if (this.isChecked(prof) || (this.showSecondary && this.isSecondaryChecked(prof))) {
        return true;
      }

      if (prof.childrenProficiencies != null) {
        for (let j = 0; j < prof.childrenProficiencies.length; j++) {
          const child: ListProficiency = prof.childrenProficiencies[j];
          if (this.isChecked(child) || (this.showSecondary && this.isSecondaryChecked(child))) {
            return true;
          }
        }
      }
    }
    return false;
  }

  profChange(event: MatCheckboxChange, listProf: ListProficiency): void {
    if (!this.isDisabled(listProf)) {
      listProf.proficient = event.checked;
    }
  }

  profSecondaryChange(event: MatCheckboxChange, listProf: ListProficiency): void {
    if (!this.isSecondaryDisabled(listProf)) {
      listProf.secondaryProficient = event.checked;
    }
  }

  isChecked(listProf: ListProficiency): boolean {
    if (listProf.proficient || listProf.inheritedProficient) {
      return true;
    }
    if (listProf.parentProficiency != null) {
      return this.isChecked(listProf.parentProficiency);
    }
    return false;
  }

  isChildChecked(listProf: ListProficiency): boolean {
    for (let i = 0; i < listProf.childrenProficiencies.length; i++) {
      if (this.isChecked(listProf.childrenProficiencies[i])) {
        return true;
      }
    }
    return false;
  }

  isSecondaryChecked(listProf: ListProficiency): boolean {
    if (listProf.secondaryProficient || listProf.inheritedSecondaryProficient) {
      return true;
    }
    if (listProf.parentProficiency != null) {
      return this.isSecondaryChecked(listProf.parentProficiency);
    }
    return false;
  }

  isChildSecondaryChecked(listProf: ListProficiency): boolean {
    for (let i = 0; i < listProf.childrenProficiencies.length; i++) {
      if (this.isSecondaryChecked(listProf.childrenProficiencies[i])) {
        return true;
      }
    }
    return false;
  }

  isDisabled(listProf: ListProficiency): boolean {
    if (listProf.inheritedProficient) {
      return true;
    }
    if (listProf.parentProficiency != null) {
      return this.isChecked(listProf.parentProficiency);
    }
    return false;
  }

  isSecondaryDisabled(listProf: ListProficiency): boolean {
    if (listProf.inheritedSecondaryProficient) {
      return true;
    }
    if (listProf.parentProficiency != null) {
      return this.isSecondaryChecked(listProf.parentProficiency);
    }
    return false;
  }

}
