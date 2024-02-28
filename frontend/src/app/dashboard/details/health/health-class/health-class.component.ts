import {Component, Input, OnInit} from '@angular/core';
import {HealthCalculationType} from '../../../../shared/models/creatures/characters/health-calculation-type.enum';
import {ListObject} from '../../../../shared/models/list-object';
import {HealthConfigurationClass} from '../health-configuration-details/health-configuration-details.component';

@Component({
  selector: 'app-health-class',
  templateUrl: './health-class.component.html',
  styleUrls: ['./health-class.component.scss']
})
export class HealthClassComponent implements OnInit {
  @Input() healthConfiguration: HealthConfigurationClass;
  @Input() healthCalculationType: HealthCalculationType;
  @Input() hpModifier = 0;
  @Input() conModifier = 0;
  @Input() levels: ListObject[] = [];

  numLevels = 0;

  constructor() { }

  ngOnInit() {
    this.numLevels = this.getNumLevels();
  }

  private getNumLevels(): number {
    const maxLevel = this.healthConfiguration.chosenClass.characterLevel;
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
}
