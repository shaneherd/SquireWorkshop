import {Component, Input} from '@angular/core';
import {CreatureConditionImmunityCollection} from '../../../shared/models/creatures/configs/creature-condition-immunity-collection';
import {CreatureConditionImmunityCollectionItem} from '../../../shared/models/creatures/configs/creature-condition-immunity-collection-item';
import {InheritedFrom} from '../../../shared/models/creatures/inherited-from';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {TranslateService} from '@ngx-translate/core';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-creature-condition-immunity-configurations',
  templateUrl: './creature-condition-immunity-configurations.component.html',
  styleUrls: ['./creature-condition-immunity-configurations.component.scss']
})
export class CreatureConditionImmunityConfigurationsComponent {
  @Input() conditionImmunityConfigurationCollection: CreatureConditionImmunityCollection;

  constructor(
    private translate: TranslateService
  ) { }

  immunityChange(event: MatCheckboxChange, item: CreatureConditionImmunityCollectionItem): void {
    item.immune = event.checked;
  }

  getTooltip(item: CreatureConditionImmunityCollectionItem): string {
    const parts = [];
    item.inheritedFrom.forEach((inheritedFrom: InheritedFrom) => {
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
