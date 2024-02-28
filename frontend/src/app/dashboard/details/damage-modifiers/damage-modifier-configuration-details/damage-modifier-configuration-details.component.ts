import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatureDamageModifierCollectionItem} from '../../../../shared/models/creatures/configs/creature-damage-modifier-collection-item';
import {DamageModifierType} from '../../../../shared/models/characteristics/damage-modifier-type.enum';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-damage-modifier-configuration-details',
  templateUrl: './damage-modifier-configuration-details.component.html',
  styleUrls: ['./damage-modifier-configuration-details.component.scss']
})
export class DamageModifierConfigurationDetailsComponent implements OnInit {
  @Input() creature: Creature;
  @Input() item: CreatureDamageModifierCollectionItem;
  @Output() close = new EventEmitter();

  disabled = false;
  damageModifierType: DamageModifierType = DamageModifierType.NORMAL;
  damageModifierTypes: DamageModifierType[] = [];

  constructor(
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.damageModifierType = this.creatureService.getDamageModifierType(this.item);
    this.disabled = this.item.inheritedDamageModifierTypes.length > 0;
    this.initializeDamageModifierTypes();
  }

  private initializeDamageModifierTypes(): void {
    this.damageModifierTypes = [];
    this.damageModifierTypes.push(DamageModifierType.NORMAL);
    this.damageModifierTypes.push(DamageModifierType.VULNERABLE);
    this.damageModifierTypes.push(DamageModifierType.RESISTANT);
    this.damageModifierTypes.push(DamageModifierType.IMMUNE);
  }

  saveDetails(): void {
    this.item.damageModifierType = this.damageModifierType;
    this.creatureService.updateDamageModifier(this.creature, this.item).then(() => {
      this.closeDetails();
    });
  }

  closeDetails(): void {
    if (this.close != null) {
      this.close.emit();
    }
  }

  changeDamageModifierType(damageModifierType: DamageModifierType): void {
    if (!this.disabled) {
      this.damageModifierType = damageModifierType;
    }
  }

  getTooltip(damageModifierType: DamageModifierType): string {
    return this.creatureService.getDamageModifierTooltip(this.item, damageModifierType);
  }

}
