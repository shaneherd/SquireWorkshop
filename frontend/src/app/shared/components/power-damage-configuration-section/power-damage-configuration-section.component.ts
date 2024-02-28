import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AttackType} from '../../models/attack-type.enum';
import {ListObject} from '../../models/list-object';
import {DamageConfiguration} from '../../models/damage-configuration';
import {DamageConfigurationCollection} from '../../models/damage-configuration-collection';
import {AbilityService} from '../../../core/services/attributes/ability.service';
import {CharacterLevelService} from '../../../core/services/character-level.service';
import {TranslateService} from '@ngx-translate/core';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-power-damage-configuration-section',
  templateUrl: './power-damage-configuration-section.component.html',
  styleUrls: ['./power-damage-configuration-section.component.scss']
})
export class PowerDamageConfigurationSectionComponent implements OnInit {
  @Input() damageConfigurationCollection: DamageConfigurationCollection = new DamageConfigurationCollection();
  @Input() editing = false;
  @Input() disabled = false;
  @Input() showExtra = false;
  @Input() baseLevel = 1;
  @Input() showAdvancement = false;
  @Input() isSpell = false;
  @Output() configuringChange = new EventEmitter();

  characterLevels: ListObject[] = [];
  attackTypes: AttackType[] = [];
  abilities: ListObject[] = [];
  configuringDamage: DamageConfiguration;
  addingDamage = false;
  none = '';

  constructor(
    private abilityService: AbilityService,
    private characterLevelService: CharacterLevelService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeAttackTypes();
    this.initializeAbilities();
    this.initializeLevels();
  }

  initializeLevels(): void {
    this.none = this.translate.instant('None');
    this.characterLevels = [];
    this.characterLevelService.getLevels().then((characterLevels: ListObject[]) => {
      this.characterLevels = characterLevels;
    });
  }

  isAttack(): boolean {
    return this.damageConfigurationCollection.attackType === AttackType.ATTACK;
  }

  isSave(): boolean {
    return this.damageConfigurationCollection.attackType === AttackType.SAVE;
  }

  isHealing(): boolean {
    return this.damageConfigurationCollection.attackType === AttackType.HEAL;
  }

  isDamage(): boolean {
    return this.damageConfigurationCollection.attackType === AttackType.DAMAGE;
  }

  isNone(): boolean {
    return this.damageConfigurationCollection.attackType === AttackType.NONE;
  }

  initializeAttackTypes(): void {
    this.attackTypes = [];
    this.attackTypes.push(AttackType.ATTACK);
    this.attackTypes.push(AttackType.SAVE);
    this.attackTypes.push(AttackType.HEAL);
    this.attackTypes.push(AttackType.DAMAGE);
    this.attackTypes.push(AttackType.NONE);
  }

  initializeAbilities(): void {
    this.abilities = [];
    this.abilityService.getAbilities().then((abilities: ListObject[]) => {
      abilities = abilities.slice(0);
      const noAbility = new ListObject('0', '');
      abilities.unshift(noAbility);
      this.abilities = abilities;
    });
  }

  attackTypeChange(value: AttackType): void {
    this.damageConfigurationCollection.attackType = value;
    this.updateHealing(value === AttackType.HEAL, this.damageConfigurationCollection.damageConfigurations);
    this.updateHealing(value === AttackType.HEAL, this.damageConfigurationCollection.extraDamageConfigurations);
    this.updateHealing(value === AttackType.HEAL, this.damageConfigurationCollection.advancementDamageConfigurations);
  }

  updateHealing(healing: boolean, configs: DamageConfiguration[]): void {
    configs.forEach((config: DamageConfiguration) => {
      config.healing = healing;
    });
  }

  attackModChange(input): void {
    this.damageConfigurationCollection.attackMod = input.value;
  }

  saveProficiencyModifierChange(event: MatCheckboxChange): void {
    this.damageConfigurationCollection.saveProficiencyModifier = event.checked;
  }

  getSelectedAttackAbilityModifier(): string {
    for (let i = 0; i < this.abilities.length; i++) {
      if (this.abilities[i].id === this.damageConfigurationCollection.attackAbilityMod) {
        return this.abilities[i].name;
      }
    }
    return '';
  }

  getSelectedSaveAbilityModifier(): string {
    for (let i = 0; i < this.abilities.length; i++) {
      if (this.abilities[i].id === this.damageConfigurationCollection.saveAbilityModifier) {
        return this.abilities[i].name;
      }
    }
    return '';
  }

  temporaryHPChange(event: MatCheckboxChange): void {
    this.damageConfigurationCollection.temporaryHP = event.checked;
  }

  abilityChange(value: string): void {
    this.damageConfigurationCollection.saveType = this.getAbility(value);
  }

  halfOnSaveChange(event: MatCheckboxChange): void {
    this.damageConfigurationCollection.halfOnSave = event.checked;
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

  configureDamage(config: DamageConfiguration): void {
    if (this.disabled || this.configuringDamage != null) {
      return;
    }
    this.addingDamage = false;
    this.configuringDamage = config;
    this.configuringChange.emit(true);
  }

  damageConfigurationClose(): void {
    this.configuringDamage = null;
    this.addingDamage = false;
    this.configuringChange.emit(false);
  }

  damageConfigurationContinue(config: DamageConfiguration): void {
    if (this.addingDamage) {
      if (config.extra) {
        this.damageConfigurationCollection.extraDamageConfigurations.push(config);
      } else if (config.characterAdvancement) {
        this.damageConfigurationCollection.advancementDamageConfigurations.push(config);
      } else {
        this.damageConfigurationCollection.damageConfigurations.push(config);
      }
    }
    this.configuringDamage = null;
    this.addingDamage = false;
    this.configuringChange.emit(false);
  }

  deleteDamage(config: DamageConfiguration): void {
    if (this.disabled || this.configuringDamage != null) {
      return;
    }
    const index = this.damageConfigurationCollection.damageConfigurations.indexOf(config);
    if (index > -1) {
      this.damageConfigurationCollection.damageConfigurations.splice(index, 1);
    }
  }

  deleteExtraDamage(config: DamageConfiguration): void {
    if (this.disabled || this.configuringDamage != null) {
      return;
    }
    const index = this.damageConfigurationCollection.extraDamageConfigurations.indexOf(config);
    if (index > -1) {
      this.damageConfigurationCollection.extraDamageConfigurations.splice(index, 1);
    }
  }

  deleteAdvancementDamage(config: DamageConfiguration): void {
    if (this.disabled || this.configuringDamage != null) {
      return;
    }
    const index = this.damageConfigurationCollection.advancementDamageConfigurations.indexOf(config);
    if (index > -1) {
      this.damageConfigurationCollection.advancementDamageConfigurations.splice(index, 1);
    }
  }

  addDamage(): void {
    if (this.disabled || this.configuringDamage != null) {
      return;
    }
    this.addingDamage = true;
    const damage = new DamageConfiguration();
    damage.healing = this.damageConfigurationCollection.attackType === AttackType.HEAL;
    this.configuringDamage = damage;
    this.configuringChange.emit(true);
  }

  addExtraDamage(): void {
    if (this.disabled || this.configuringDamage != null) {
      return;
    }
    this.addingDamage = true;
    const extraDamage = new DamageConfiguration();
    extraDamage.extra = true;
    extraDamage.healing = this.damageConfigurationCollection.attackType === AttackType.HEAL;
    this.configuringDamage = extraDamage;
    this.configuringChange.emit(true);
  }

  addAdvancementDamage(): void {
    if (this.disabled || this.configuringDamage != null) {
      return;
    }
    this.addingDamage = true;
    const advancementDamage = new DamageConfiguration();
    advancementDamage.characterAdvancement = true;
    advancementDamage.healing = this.damageConfigurationCollection.attackType === AttackType.HEAL;
    this.configuringDamage = advancementDamage;
    this.configuringChange.emit(true);
  }

  extraDamageChange(event: MatCheckboxChange): void {
    this.damageConfigurationCollection.extraDamage = event.checked;
  }

  advancementDamageChange(event: MatCheckboxChange): void {
    this.damageConfigurationCollection.advancement = event.checked;
  }

  numLevelsAboveBaseChange(input): void {
    this.damageConfigurationCollection.numLevelsAboveBase = input.value;
  }

  hasLevel(level: ListObject): boolean {
    for (let i = 0; i < this.damageConfigurationCollection.advancementDamageConfigurations.length; i++) {
      const current = this.damageConfigurationCollection.advancementDamageConfigurations[i];
      if (current.level.id === level.id) {
        return true;
      }
    }
    return false;
  }

}
