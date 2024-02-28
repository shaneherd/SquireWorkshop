import {Component, Input} from '@angular/core';
import {ConditionImmunityConfigurationCollection} from '../../models/condition-immunity-configuration-collection';
import {ConditionImmunityConfigurationCollectionItem} from '../../models/condition-immunity-configuration-collection-item';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ListObject} from '../../models/list-object';

@Component({
  selector: 'app-condition-immunity-configurations',
  templateUrl: './condition-immunity-configurations.component.html',
  styleUrls: ['./condition-immunity-configurations.component.scss']
})
export class ConditionImmunityConfigurationsComponent {
  @Input() editing: boolean;
  @Input() loading: boolean;
  @Input() showTooltips = true;
  @Input() conditionImmunityConfigurationCollection: ConditionImmunityConfigurationCollection;
  @Input() conditionImmunities: ListObject[] = [];
  @Input() inheritedConditionImmunities: ListObject[] = [];

  constructor() { }

  immunityChange(event: MatCheckboxChange, config: ConditionImmunityConfigurationCollectionItem): void {
    config.immune = event.checked;
  }
}
