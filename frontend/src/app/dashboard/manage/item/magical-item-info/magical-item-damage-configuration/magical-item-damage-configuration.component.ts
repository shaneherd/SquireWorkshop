import {Component, Input, OnInit} from '@angular/core';
import {AttackType} from '../../../../../shared/models/attack-type.enum';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ListObject} from '../../../../../shared/models/list-object';
import {DamageConfiguration} from '../../../../../shared/models/damage-configuration';
import {MagicalItem} from '../../../../../shared/models/items/magical-item';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-magical-item-damage-configuration',
  templateUrl: './magical-item-damage-configuration.component.html',
  styleUrls: ['./magical-item-damage-configuration.component.scss']
})
export class MagicalItemDamageConfigurationComponent implements OnInit {
  @Input() magicalItem: MagicalItem;
  @Input() abilities: ListObject[];
  @Input() editing: boolean;
  @Input() disabled: boolean;
  @Input() showAllAsAdditional: boolean;
  @Input() showAttackType = true;
  @Input() showAttackMod = true;

  none = '';
  isAttack = false;
  isSave = false;
  isHeal = false;
  isDamage = false;
  isNone = false;

  attackTypes: AttackType[] = [];
  addingDamage = false;
  configuringDamage: DamageConfiguration;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.none = this.translate.instant('None');
    this.initializeAttackTypes();
    this.updateAttackTypeFlags();
  }

  private initializeAttackTypes(): void {
    this.attackTypes = [];
    this.attackTypes.push(AttackType.SAVE);
    this.attackTypes.push(AttackType.HEAL);
    this.attackTypes.push(AttackType.DAMAGE);
    this.attackTypes.push(AttackType.NONE);
  }

  attackTypeChange(value: AttackType): void {
    this.magicalItem.attackType = value;
    this.updateAttackTypeFlags();
    this.updateHealing(value === AttackType.HEAL, this.magicalItem.damages);
  }

  attackModChange(input): void {
    this.magicalItem.attackMod = input.value;
  }

  updateHealing(healing: boolean, configs: DamageConfiguration[]): void {
    configs.forEach((config: DamageConfiguration) => {
      config.healing = healing;
    });
  }

  private updateAttackTypeFlags(): void {
    this.isAttack = this.magicalItem.attackType === AttackType.ATTACK;
    this.isSave = this.magicalItem.attackType === AttackType.SAVE;
    this.isHeal = this.magicalItem.attackType === AttackType.HEAL;
    this.isDamage = this.magicalItem.attackType === AttackType.DAMAGE;
    this.isNone = this.magicalItem.attackType === AttackType.NONE;
  }

  halfOnSaveChange(event: MatCheckboxChange): void {
    this.magicalItem.halfOnSave = event.checked;
  }

  temporaryHPChange(event: MatCheckboxChange): void {
    this.magicalItem.temporaryHP = event.checked;
  }

  abilityChange(value: string): void {
    this.magicalItem.saveType = this.getAbility(value);
  }

  getAbility(id: string): ListObject {
    for (let i = 0; i < this.abilities.length; i++) {
      const ability: ListObject = this.abilities[i];
      if (ability.id === id) {
        return ability;
      }
    }
    return null;
  }

  deleteDamage(config: DamageConfiguration): void {
    if (this.disabled) {
      return;
    }
    const index = this.magicalItem.damages.indexOf(config);
    if (index > -1) {
      this.magicalItem.damages.splice(index, 1);
    }
    this.updateDisabled();
  }

  configureDamage(config: DamageConfiguration): void {
    if (this.disabled) {
      return;
    }
    this.addingDamage = false;
    this.configuringDamage = config;
    this.updateDisabled();
  }

  addDamage(): void {
    if (this.disabled) {
      return;
    }
    this.addingDamage = true;
    const damage = new DamageConfiguration();
    damage.healing = this.magicalItem.attackType === AttackType.HEAL;
    this.configuringDamage = damage;
    this.updateDisabled();
  }

  damageConfigurationClose(): void {
    this.configuringDamage = null;
    this.addingDamage = false;
    this.updateDisabled();
  }

  damageConfigurationContinue(config: DamageConfiguration): void {
    if (this.addingDamage) {
      this.magicalItem.damages.push(config);
    }
    this.configuringDamage = null;
    this.addingDamage = false;
    this.updateDisabled();
  }

  private updateDisabled(): void {
    //todo
  }

}
