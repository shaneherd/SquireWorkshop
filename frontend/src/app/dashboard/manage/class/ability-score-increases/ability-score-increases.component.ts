import {Component, Input} from '@angular/core';
import {AbilityScoreIncreaseCollection} from '../../../../shared/models/characteristics/ability-score-increase-collection';
import {AbilityScoreIncreaseCollectionItem} from '../../../../shared/models/characteristics/ability-score-increase-collection-item';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-ability-score-increases',
  templateUrl: './ability-score-increases.component.html',
  styleUrls: ['./ability-score-increases.component.scss']
})
export class AbilityScoreIncreasesComponent {
  @Input() editing: boolean;
  @Input() loading: boolean;
  @Input() abilityScoreIncreaseCollection: AbilityScoreIncreaseCollection;

  constructor() { }

  levelChange(event: MatCheckboxChange, level: AbilityScoreIncreaseCollectionItem): void {
    if (!this.isDisabled(level)) {
      level.checked = event.checked;
    }
  }

  isChecked(level: AbilityScoreIncreaseCollectionItem): boolean {
    return level.checked || level.inheritedChecked;
  }

  isDisabled(level: AbilityScoreIncreaseCollectionItem): boolean {
    return level.inheritedChecked;
  }

  hasModifiers(): boolean {
    for (let i = 0; i < this.abilityScoreIncreaseCollection.levels.length; i++) {
      if (this.abilityScoreIncreaseCollection.levels[i].checked) {
        return true;
      }
    }
    return false;
  }

}
