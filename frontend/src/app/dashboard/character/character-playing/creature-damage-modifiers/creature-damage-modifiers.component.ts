import {Component, Input} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureDamageModifierCollectionItem} from '../../../../shared/models/creatures/configs/creature-damage-modifier-collection-item';
import {DamageModifierType} from '../../../../shared/models/characteristics/damage-modifier-type.enum';
import {TranslateService} from '@ngx-translate/core';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-creature-damage-modifiers',
  templateUrl: './creature-damage-modifiers.component.html',
  styleUrls: ['./creature-damage-modifiers.component.scss']
})
export class CreatureDamageModifiersComponent {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;

  configuringDamageType: CreatureDamageModifierCollectionItem = null;

  constructor(
    private translate: TranslateService,
    private creatureService: CreatureService
  ) { }

  click(item: CreatureDamageModifierCollectionItem): void {
    if (this.configuringDamageType == null) {
      this.configuringDamageType = item;
    }
  }

  configurationClose(): void {
    this.configuringDamageType = null;
  }

  getModifierType(item: CreatureDamageModifierCollectionItem): DamageModifierType {
    return this.creatureService.getDamageModifierType(item);
  }

  getTooltip(item: CreatureDamageModifierCollectionItem): string {
    return this.creatureService.getDamageModifierTooltip(item, this.getModifierType(item));
  }
}
