import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CharacterLevelService} from '../../../core/services/character-level.service';
import {ModifierConfiguration} from '../../models/modifier-configuration';
import {AttributeService} from '../../../core/services/attributes/attribute.service';
import {ModifierCategory} from '../../models/modifier-category.enum';
import {ListObject} from '../../models/list-object';
import {ModifierSubCategory} from '../../models/modifier-sub-category.enum';
import {ModifierType} from '../../models/modifier-type';
import * as _ from 'lodash';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {AbilityService} from '../../../core/services/attributes/ability.service';
import {TranslateService} from '@ngx-translate/core';
import {SID} from '../../../constants';

@Component({
  selector: 'app-power-modifier-configuration',
  templateUrl: './power-modifier-configuration.component.html',
  styleUrls: ['./power-modifier-configuration.component.scss']
})
export class PowerModifierConfigurationComponent implements OnInit {
  loading = false;
  @Input() modifierConfiguration: ModifierConfiguration;
  @Input() modifierConfigurationsInUse: ModifierConfiguration[] = [];
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();

  levels: ListObject[] = [];
  selectedLevel: ListObject = new ListObject('0', '');

  abilities: ListObject[] = [];
  isAbility = true;
  isProficiency = true;

  modifierTypes: ModifierType[] = [];
  allModifierTypes = new Map<ModifierCategory, ModifierType[]>();

  modifierType: ModifierType = null;
  value = 0;
  adjustment = true;
  proficient = false;
  halfProficient = false;
  roundUp = false;
  advantage = false;
  disadvantage = false;
  useLevel = false;
  useHalfLevel = false;
  abilityModifier: ListObject = new ListObject('0', '');

  modifierCategories: ModifierCategory[] = [];
  modifierSubCategories: ModifierSubCategory[] = [];

  selectedModifierCategory: ModifierCategory = ModifierCategory.MISC;
  selectedModifierSubCategory: ModifierSubCategory = ModifierSubCategory.OTHER;

  constructor(
    private attributeService: AttributeService,
    private characterLevelService: CharacterLevelService,
    private abilityService: AbilityService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeAbilities();
    this.initializeLevels();
    this.initializeModifierCategories();
    this.initializeModifierTypes();
    this.value = this.modifierConfiguration.value;
    this.adjustment = this.modifierConfiguration.adjustment;
    this.proficient = this.modifierConfiguration.proficient;
    this.halfProficient = this.modifierConfiguration.halfProficient;
    this.roundUp = this.modifierConfiguration.roundUp;
    this.advantage = this.modifierConfiguration.advantage;
    this.disadvantage = this.modifierConfiguration.disadvantage;
    this.useLevel = this.modifierConfiguration.useLevel;
    this.useHalfLevel = this.modifierConfiguration.useHalfLevel;
    this.initializeSelectedAbility();
  }

  private initializeAbilities(): void {
    this.abilities = [];
    this.abilities.push(new ListObject('0', this.translate.instant('none')));
    this.abilities = this.abilities.concat(this.abilityService.getAbilitiesDetailedFromStorageAsListObject());
  }

  private initializeSelectedAbility(): void {
    if (this.modifierConfiguration.abilityModifier == null || this.modifierConfiguration.abilityModifier.id === '0') {
      this.abilityModifier = this.abilities[0];
    } else {
      for (let i = 0; i < this.abilities.length; i++) {
        const ability = this.abilities[i];
        if (ability.id === this.modifierConfiguration.abilityModifier.id) {
          this.abilityModifier = ability;
          return;
        }
      }
    }
  }

  private initializeLevels(): void {
    this.characterLevelService.getLevels().then((levels: ListObject[]) => {
      this.levels = levels;
      this.initializeSelectedLevel();
    });
  }

  private initializeSelectedLevel(): void {
    if (this.modifierConfiguration.level == null) {
      if (this.levels.length > 0) {
        this.selectedLevel = this.levels[0];
      }
      return;
    }
    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      if (level.id === this.modifierConfiguration.level.id) {
        this.selectedLevel = level;
        return;
      }
    }
  }

  levelChange(value: ListObject): void {
    this.selectedLevel = value;
    this.filterTypes();
  }

  private initializeModifierTypes(): void {
    this.modifierTypes = [];
    this.attributeService.getModifierTypes().then((modifierTypes: ModifierType[]) => {
      this.allModifierTypes = new Map<ModifierCategory, ModifierType[]>();

      modifierTypes.forEach((modifierType: ModifierType) => {
        if (!this.allModifierTypes.has(modifierType.modifierCategory)) {
          this.allModifierTypes.set(modifierType.modifierCategory, []);
        }
        this.allModifierTypes.get(modifierType.modifierCategory).push(modifierType);
      });

      this.filterTypes();
    });
  }

  private initializeModifierCategories(): void {
    this.modifierCategories = [];
    this.modifierCategories.push(ModifierCategory.ABILITY);
    this.modifierCategories.push(ModifierCategory.SKILL);
    this.modifierCategories.push(ModifierCategory.SPEED);
    this.modifierCategories.push(ModifierCategory.SPELL);
    this.modifierCategories.push(ModifierCategory.ATTACK);
    this.modifierCategories.push(ModifierCategory.DAMAGE);
    this.modifierCategories.push(ModifierCategory.MISC);

    //todo - add more types
    //attack mod (melee, ranged, both)
    //damage mod

    this.initializeSelectedAttributeType();
  }

  private initializeSelectedAttributeType(): void {
    this.selectedModifierCategory = this.modifierConfiguration.attribute == null ? ModifierCategory.ABILITY : this.modifierConfiguration.modifierCategory;
    this.selectedModifierSubCategory = this.modifierConfiguration.modifierSubCategory;
    this.initializeSubCategories();
    this.isAbility = this.selectedModifierCategory === ModifierCategory.ABILITY;
  }

  modifierCategoryChange(modifierCategory: ModifierCategory): void {
    this.selectedModifierCategory = modifierCategory;
    this.initializeSubCategories();
    this.filterTypes();
    this.isAbility = this.selectedModifierCategory === ModifierCategory.ABILITY;
  }

  private updateAllowProf(): void {
    this.isProficiency = this.selectedModifierCategory === ModifierCategory.MISC && this.modifierType.attribute.sid === SID.MISC_ATTRIBUTES.PROFICIENCY;
  }

  private initializeSubCategories(): void {
    const modifierSubCategories = [];
    switch (this.selectedModifierCategory) {
      case ModifierCategory.ABILITY:
        modifierSubCategories.push(ModifierSubCategory.SCORE);
        modifierSubCategories.push(ModifierSubCategory.SAVE);
        break;
      case ModifierCategory.SKILL:
        modifierSubCategories.push(ModifierSubCategory.SCORE);
        modifierSubCategories.push(ModifierSubCategory.PASSIVE);
        break;
    }
    this.modifierSubCategories = modifierSubCategories;

    this.initializeSelectedSubCategory();
  }

  private initializeSelectedSubCategory(): void {
    if (this.modifierSubCategories.length > 0) {
      const index = _.indexOf(this.modifierSubCategories, this.selectedModifierSubCategory);
      if (index === -1) {
        this.selectedModifierSubCategory = this.modifierSubCategories[0];
      }
    }
  }

  modifierSubCategoryChange(modifierSubCategory: ModifierSubCategory): void {
    this.selectedModifierSubCategory = modifierSubCategory;
    this.filterTypes();
  }

  private filterTypes(): void {
    const list: ModifierType[] = [];
    const applicableModifierTypes = this.allModifierTypes.get(this.selectedModifierCategory);

    if (applicableModifierTypes != null && applicableModifierTypes.length > 0) {
      applicableModifierTypes.forEach((modifierType: ModifierType) => {
        if (this.isSelectedType(modifierType) || !this.isModifierTypeInUse(modifierType)) {
          list.push(modifierType);
        }
      });
    }

    this.modifierTypes = list;
    this.initializeSelectedModifierType();
    this.updateAllowProf();
  }

  private isModifierTypeInUse(modifierType: ModifierType): boolean {
    for (let i = 0; i < this.modifierConfigurationsInUse.length; i++) {
      const config = this.modifierConfigurationsInUse[i];
      if (config.attribute.id === modifierType.attribute.id &&
        config.modifierSubCategory === this.selectedModifierSubCategory &&
        (!this.modifierConfiguration.characterAdvancement || config.level.id === this.selectedLevel.id)) {
        return true;
      }
    }
    return false;
  }

  private isSelectedType(modifierType: ModifierType): boolean {
    return this.modifierConfiguration.attribute != null &&
      modifierType.attribute.id === this.modifierConfiguration.attribute.id &&
      this.selectedModifierSubCategory === this.modifierConfiguration.modifierSubCategory;
  }

  private initializeSelectedModifierType(): void {
    if (this.modifierConfiguration.attribute != null) {
      for (let i = 0; i < this.modifierTypes.length; i++) {
        const modifierType = this.modifierTypes[i];
        if (this.isSelectedType(modifierType)) {
          this.modifierType = modifierType;
          return;
        }
      }
    }
    if (this.modifierTypes.length > 0) {
      this.modifierType = this.modifierTypes[0];
    } else {
      this.modifierType = new ModifierType();
    }
  }

  modifierTypeChange(value: ModifierType): void {
    this.modifierType = value;
    this.updateAllowProf();
  }

  valueChange(input) {
    this.value = input.value;
  }

  abilityModifierChange(value: ListObject): void {
    this.abilityModifier = value;
  }

  adjustmentChange(event: MatCheckboxChange): void {
    this.adjustment = event.checked;
  }

  profChange(event: MatCheckboxChange): void {
    this.proficient = event.checked;
    if (this.proficient) {
      this.halfProficient = false;
    }
  }

  halfProfChange(event: MatCheckboxChange): void {
    this.halfProficient = event.checked;
    if (this.halfProficient) {
      this.proficient = false;
    }
  }

  useLevelChange(event: MatCheckboxChange): void {
    this.useLevel = event.checked;
    if (this.useLevel) {
      this.useHalfLevel = false;
    }
  }

  useHalfLevelChange(event: MatCheckboxChange): void {
    this.useHalfLevel = event.checked;
    if (this.useHalfLevel) {
      this.useLevel = false;
    }
  }

  advantageChange(event: MatCheckboxChange): void {
    this.advantage = event.checked;
    if (this.advantage) {
      this.disadvantage = false;
    }
  }

  disadvantageChange(event: MatCheckboxChange): void {
    this.disadvantage = event.checked;
    if (this.disadvantage) {
      this.advantage = false;
    }
  }

  continueClick(): void {
    this.modifierConfiguration.attribute = this.modifierType.attribute;
    this.modifierConfiguration.modifierCategory = this.selectedModifierCategory;
    this.modifierConfiguration.modifierSubCategory = this.selectedModifierSubCategory;
    this.modifierConfiguration.characteristicDependant = this.modifierType.characteristicDependant;
    this.modifierConfiguration.value = this.value;
    this.modifierConfiguration.adjustment = this.adjustment;
    this.modifierConfiguration.proficient = !this.isAbility && !this.isProficiency && this.proficient;
    this.modifierConfiguration.halfProficient = !this.isAbility && !this.isProficiency && this.halfProficient;
    this.modifierConfiguration.roundUp = this.roundUp;
    this.modifierConfiguration.advantage = this.advantage;
    this.modifierConfiguration.disadvantage = this.disadvantage;
    this.modifierConfiguration.level = this.selectedLevel;
    this.modifierConfiguration.useLevel = this.useLevel;
    this.modifierConfiguration.useHalfLevel = this.useHalfLevel;
    this.modifierConfiguration.abilityModifier = !this.isAbility && !this.isProficiency ? this.abilityModifier : null;
    this.continue.emit(this.modifierConfiguration);
  }

  cancelClick(): void {
    this.close.emit();
  }
}
