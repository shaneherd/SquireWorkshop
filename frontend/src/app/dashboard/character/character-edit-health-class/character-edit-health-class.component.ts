import {Component, Input} from '@angular/core';
import {ChosenClass} from '../../../shared/models/creatures/characters/chosen-class';
import {ListObject} from '../../../shared/models/list-object';
import {HealthGainResult} from '../../../shared/models/creatures/characters/health-gain-result';
import {HealthCalculationType} from '../../../shared/models/creatures/characters/health-calculation-type.enum';
import {CharacterService} from '../../../core/services/creatures/character.service';

@Component({
  selector: 'app-character-edit-health-class',
  templateUrl: './character-edit-health-class.component.html',
  styleUrls: ['./character-edit-health-class.component.scss']
})
export class CharacterEditHealthClassComponent {
  @Input() chosenClass: ChosenClass;
  @Input() healthCalculationType: HealthCalculationType;
  @Input() hpModifier = 0;
  @Input() conModifier = 0;
  @Input() levels: ListObject[] = [];

  constructor(
    private characterService: CharacterService
  ) { }

  showLevel(level: ListObject): boolean {
    const maxLevel = this.chosenClass.characterLevel;
    if (maxLevel == null) {
      return false;
    }
    if (level.id === maxLevel.id) {
      return true;
    }
    return this.isBelowMax(level);
  }

  getNumLevels(): number {
    const maxLevel = this.chosenClass.characterLevel;
    if (maxLevel == null) {
      return 0;
    }
    let quantity = 0;
    for (let i = 0; i < this.levels.length; i++) {
      const current = this.levels[i];
      quantity++;
      if (current.id === maxLevel.id) {
        break;
      }
    }
    return quantity;
  }

  private isBelowMax(level: ListObject): boolean {
    const maxLevel = this.chosenClass.characterLevel;
    for (let i = 0; i < this.levels.length; i++) {
      const current = this.levels[i];
      if (current.id === maxLevel.id) {
        return false;
      }
      if (current.id === level.id) {
        return true;
      }
    }
    return false;
  }

  getHealthGainResult(level: ListObject): HealthGainResult {
    for (let i = 0; i < this.chosenClass.healthGainResults.length; i++) {
      const result = this.chosenClass.healthGainResults[i];
      if (result.level.id === level.id) {
        return result;
      }
    }

    const healthGainResult = new HealthGainResult(level);
    this.characterService.updateHealthGainSingleResult(healthGainResult, this.chosenClass, this.healthCalculationType);
    this.chosenClass.healthGainResults.push(healthGainResult);
    return healthGainResult;
  }
}
