import {Component, Input} from '@angular/core';
import {SenseConfigurationCollection} from '../../models/sense-configuration-collection';
import {SenseConfigurationCollectionItem} from '../../models/sense-configuration-collection-item';

@Component({
  selector: 'app-senses-configuration',
  templateUrl: './senses-configuration.component.html',
  styleUrls: ['./senses-configuration.component.scss']
})
export class SensesConfigurationComponent {
  @Input() editing: boolean;
  @Input() loading: boolean;
  @Input() showTooltips = true;
  @Input() senseConfigurationCollection: SenseConfigurationCollection;

  constructor() { }

  hasSenses(): boolean {
    for (let i = 0; i < this.senseConfigurationCollection.senses.length; i++) {
      const sense: SenseConfigurationCollectionItem = this.senseConfigurationCollection.senses[i];
      if (sense.range > 0 || sense.inheritedRange > 0) {
        return true;
      }
    }
    return false;
  }
}
