import {Component, Input, OnInit} from '@angular/core';
import {CreatureDamageModifierCollection} from '../../../shared/models/creatures/configs/creature-damage-modifier-collection';
import {DamageModifierType} from '../../../shared/models/characteristics/damage-modifier-type.enum';
import {CreatureDamageModifierCollectionItem} from '../../../shared/models/creatures/configs/creature-damage-modifier-collection-item';
import {CreatureService} from '../../../core/services/creatures/creature.service';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {InheritedDamageModifierType} from '../../../shared/models/creatures/configs/inherited-damage-modifier-type';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-creature-damage-modifier-configurations',
  templateUrl: './creature-damage-modifier-configurations.component.html',
  styleUrls: ['./creature-damage-modifier-configurations.component.scss']
})
export class CreatureDamageModifierConfigurationsComponent implements OnInit {
  @Input() damageModifierCollection: CreatureDamageModifierCollection;

  damageModifierTypes: DamageModifierType[] = [];

  constructor(
    private translate: TranslateService,
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.damageModifierTypes = [];
    this.damageModifierTypes.push(DamageModifierType.NORMAL);
    this.damageModifierTypes.push(DamageModifierType.VULNERABLE);
    this.damageModifierTypes.push(DamageModifierType.RESISTANT);
    this.damageModifierTypes.push(DamageModifierType.IMMUNE);
  }

  changeDamageModifierType(item: CreatureDamageModifierCollectionItem, modifierType: DamageModifierType): void {
    if (!this.isDisabled(item)) {
      item.damageModifierType = modifierType;
    }
  }

  isDisabled(item: CreatureDamageModifierCollectionItem): boolean {
    return item.inheritedDamageModifierTypes.length > 0;
  }

  getModifierType(item: CreatureDamageModifierCollectionItem): DamageModifierType {
    return this.creatureService.getDamageModifierType(item);
  }

  getTooltip(item: CreatureDamageModifierCollectionItem, damageModifierType: DamageModifierType): string {
    const parts = [];
    parts.push(this.translate.instant('Tooltips.DamageModifier.' + damageModifierType));
    item.inheritedDamageModifierTypes.forEach((inheritedDamageModifierType: InheritedDamageModifierType) => {
      const inheritedFrom = inheritedDamageModifierType.inheritedFrom;
      const inheritedModifierType = this.translate.instant('DamageModifier.' + inheritedDamageModifierType.damageModifierType);
      switch (inheritedFrom.type) {
        case CharacteristicType.BACKGROUND:
          parts.push(this.translate.instant('Labels.Background') + ' ' + inheritedFrom.name + ' : ' + inheritedModifierType);
          break;
        case CharacteristicType.CLASS:
          parts.push(this.translate.instant('Labels.Class') + ' ' + inheritedFrom.name + ' : ' + inheritedModifierType);
          break;
        case CharacteristicType.RACE:
          parts.push(this.translate.instant('Labels.Race') + ' ' + inheritedFrom.name + ' : ' + inheritedModifierType);
          break;
      }
    });
    return parts.join('\n');
  }

}
