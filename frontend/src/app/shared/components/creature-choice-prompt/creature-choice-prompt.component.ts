import {Component, Input} from '@angular/core';
import {CreatureListProficiency} from '../../models/creatures/creature-list-proficiency';
import {CreatureChoiceProficiency} from '../../models/creatures/configs/creature-choice-proficiency';
import {ListObject} from '../../models/list-object';

@Component({
  selector: 'app-creature-choice-prompt',
  templateUrl: './creature-choice-prompt.component.html',
  styleUrls: ['./creature-choice-prompt.component.scss']
})
export class CreatureChoicePromptComponent {
  @Input() profs: CreatureListProficiency[];
  @Input() choiceOptions: CreatureChoiceProficiency;
  @Input() checkParent = false;

  constructor() { }

  showOption(option: ListObject): boolean {
    return !this.isInherited(option);
  }

  isChosen(option: ListObject): boolean {
    const prof: CreatureListProficiency = this.getProficiency(option);
    if (prof == null) {
      return false;
    }
    return !this.checkParent && prof.inheritedFrom.length === 0 && prof.proficient;
  }

  private isInherited(option: ListObject): boolean {
    const prof = this.getProficiency(option);
    return prof != null && prof.inheritedFrom.length > 0;
  }

  private getProficiency(option: ListObject): CreatureListProficiency {
    for (let i = 0; i < this.profs.length; i++) {
      const prof = this.profs[i];
      if (prof.item.id === option.id) {
        return prof;
      }
    }
    return null;
  }

  getQuantityChosen(): number {
    let quantity = 0;
    this.profs.forEach((prof: CreatureListProficiency) => {
      if (this.checkParent) {
        quantity += this.getQuantityChildrenChosen(prof);
      } else if (prof.inheritedFrom.length === 0 && prof.proficient && this.isChoice(prof.item) &&
        !this.parentChosen(prof.parentProficiency)) {
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

  private getQuantityChildrenChosen(prof: CreatureListProficiency): number {
    if (!this.isChoice(prof.item)) {
      return 0;
    }
    let quantity = 0;
    prof.childrenProficiencies.forEach((child: CreatureListProficiency) => {
      if (child.inheritedFrom.length === 0 && child.proficient) {
        quantity++;
      }
    });
    return quantity;
  }

  private isChoice(item: ListObject): boolean {
    for (let i = 0; i < this.choiceOptions.items.length; i++) {
      if (this.choiceOptions.items[i].id === item.id) {
        return true;
      }
    }
    return false;
  }

}
