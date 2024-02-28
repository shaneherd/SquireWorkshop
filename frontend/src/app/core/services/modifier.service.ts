import { Injectable } from '@angular/core';
import {PowerModifierConfiguration} from '../../shared/models/power-modifier-configuration';
import {ModifierConfiguration} from '../../shared/models/modifier-configuration';
import {AttributeType} from '../../shared/models/attributes/attribute-type.enum';
import {ModifierSubCategory} from '../../shared/models/modifier-sub-category.enum';
import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';
import {LabelValue} from '../../shared/models/label-value';
import set = Reflect.set;

@Injectable({
  providedIn: 'root'
})
export class ModifierService {

  constructor(
    private translate: TranslateService
  ) { }

  hasSet(modifiers: Map<string, PowerModifierConfiguration>): boolean {
    return this.getSetModification(modifiers) != null;
  }

  getSetModification(modifiers: Map<string, PowerModifierConfiguration>): PowerModifierConfiguration {
    let setModification: PowerModifierConfiguration = null;
    modifiers.forEach((powerModifierConfiguration: PowerModifierConfiguration) => {
      const modifier = powerModifierConfiguration.modifierConfiguration;
      if (!modifier.adjustment) {
        if (setModification == null || modifier.value > setModification.modifierConfiguration.value) {
          setModification = powerModifierConfiguration;
        }
      }
    });
    return setModification;
  }

  getConfigurationDisplayName(modifierConfiguration: ModifierConfiguration): string {
    let name = modifierConfiguration.attribute.name;
    switch (modifierConfiguration.attribute.attributeType) {
      case AttributeType.ABILITY:
        switch (modifierConfiguration.modifierSubCategory) {
          case ModifierSubCategory.OTHER:
            name += ' (' + this.translate.instant('Modifier') + ')';
            break;
          case ModifierSubCategory.SAVE:
            name += ' (' + this.translate.instant('Save') + ')';
            break;
        }
        break;
      case AttributeType.SKILL:
        if (modifierConfiguration.modifierSubCategory === ModifierSubCategory.PASSIVE) {
          name += ' (' + this.translate.instant('Headers.Passive') + ')';
        }
        break;
    }

    return name;
  }
}
