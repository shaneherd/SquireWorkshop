import {Component, Input} from '@angular/core';
import {CreatureSensesCollection} from '../../../shared/models/creatures/configs/creature-senses-collection';
import {CreatureSenseCollectionItem} from '../../../shared/models/creatures/configs/creature-sense-collection-item';
import {InheritedSense} from '../../../shared/models/creatures/configs/inherited-sense';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-creature-sense-configurations',
  templateUrl: './creature-sense-configurations.component.html',
  styleUrls: ['./creature-sense-configurations.component.scss']
})
export class CreatureSenseConfigurationsComponent {
  @Input() senseConfigurationCollection: CreatureSensesCollection;

  constructor(
    private translate: TranslateService
  ) { }

  getInheritedRange(item: CreatureSenseCollectionItem): number {
    let range = 0;
    item.inheritedSenses.forEach((inheritedSense: InheritedSense) => {
      if (inheritedSense.range > range) {
        range = inheritedSense.range;
      }
    });
    return range;
  }

  getTooltip(item: CreatureSenseCollectionItem): string {
    const parts = [];
    item.inheritedSenses.forEach((inheritedSense: InheritedSense) => {
      const inheritedFrom = inheritedSense.inheritedFrom;
      let prefix = '';
      switch (inheritedFrom.type) {
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
      parts.push(prefix + inheritedFrom.name + ': ' + inheritedSense.range);
    });
    return parts.join('\n');
  }
}
