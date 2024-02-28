import {Component, Input, OnInit} from '@angular/core';
import {DamageModifierCollection} from '../../../../shared/models/damage-modifier-collection';
import {DamageModifierType} from '../../../../shared/models/characteristics/damage-modifier-type.enum';
import {DamageModifierCollectionItem} from '../../../../shared/models/damage-modifier-collection-item';
import {DamageModifier} from '../../../../shared/models/characteristics/damage-modifier';

@Component({
  selector: 'app-damage-modifier-configurations',
  templateUrl: './damage-modifier-configurations.component.html',
  styleUrls: ['./damage-modifier-configurations.component.scss']
})
export class DamageModifierConfigurationsComponent implements OnInit {
  @Input() editing: boolean;
  @Input() loading: boolean;
  @Input() showTooltips = true;
  @Input() damageModifierCollection: DamageModifierCollection;
  @Input() damageModifiers: DamageModifier[] = [];
  @Input() inheritedDamageModifiers: DamageModifier[] = [];

  damageModifierTypes: DamageModifierType[] = [];

  constructor() { }

  ngOnInit() {
    this.damageModifierTypes = [];
    this.damageModifierTypes.push(DamageModifierType.NORMAL);
    this.damageModifierTypes.push(DamageModifierType.VULNERABLE);
    this.damageModifierTypes.push(DamageModifierType.RESISTANT);
    this.damageModifierTypes.push(DamageModifierType.IMMUNE);
  }

  changeDamageModifierType(item: DamageModifierCollectionItem, modifierType: DamageModifierType): void {
    if (!this.isDisabled(item)) {
      item.damageModifierType = modifierType;
    }
  }

  isDisabled(item: DamageModifierCollectionItem): boolean {
    return item.inheritedDamageModifierType !== DamageModifierType.NORMAL;
  }

  getModifierType(item: DamageModifierCollectionItem): DamageModifierType {
    if (item.inheritedDamageModifierType !== DamageModifierType.NORMAL) {
      return item.inheritedDamageModifierType;
    }
    return item.damageModifierType;
  }

  isModified(modifier: DamageModifierCollectionItem): boolean {
    return modifier.damageModifierType !== DamageModifierType.NORMAL;
  }
}
