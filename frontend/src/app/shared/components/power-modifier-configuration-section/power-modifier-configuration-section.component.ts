import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModifierConfiguration} from '../../models/modifier-configuration';
import {ModifierConfigurationCollection} from '../../models/modifier-configuration-collection';
import {CharacterLevelService} from '../../../core/services/character-level.service';
import {ListObject} from '../../models/list-object';
import {ModifierService} from '../../../core/services/modifier.service';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-power-modifier-configuration-section',
  templateUrl: './power-modifier-configuration-section.component.html',
  styleUrls: ['./power-modifier-configuration-section.component.scss']
})
export class PowerModifierConfigurationSectionComponent implements OnInit {
  @Input() modifierConfigurationCollection: ModifierConfigurationCollection = new ModifierConfigurationCollection();
  @Input() editing = false;
  @Input() disabled = false;
  @Input() showExtra = false;
  @Input() baseLevel = 1;
  @Input() showAdvancement = false;
  @Output() configuringChange = new EventEmitter();

  characterLevels: ListObject[] = [];
  configuringModifier: ModifierConfiguration;
  modifierConfigurationsInUse: ModifierConfiguration[] = [];
  addingModifier = false;

  constructor(
    private characterLevelService: CharacterLevelService,
    private modifierService: ModifierService
  ) { }

  ngOnInit() {
    this.initializeLevels();
  }

  initializeLevels(): void {
    this.characterLevels = [];
    this.characterLevelService.getLevels().then((characterLevels: ListObject[]) => {
      this.characterLevels = characterLevels;
    });
  }

  configureModifier(config: ModifierConfiguration): void {
    if (this.disabled || this.configuringModifier != null) {
      return;
    }
    this.addingModifier = false;
    this.configuringModifier = config;

    if (config.extra) {
      this.modifierConfigurationsInUse = this.modifierConfigurationCollection.advancementModifierConfigurations;
    } else if (config.characterAdvancement) {
      this.modifierConfigurationsInUse = this.modifierConfigurationCollection.extraModifierConfigurations;
    } else {
      this.modifierConfigurationsInUse = this.modifierConfigurationCollection.modifierConfigurations;
    }
    this.configuringChange.emit(true);
  }

  modifierConfigurationClose(): void {
    this.configuringModifier = null;
    this.modifierConfigurationsInUse = null;
    this.addingModifier = false;
    this.configuringChange.emit(false);
  }

  modifierConfigurationContinue(config: ModifierConfiguration): void {
    if (this.addingModifier) {
      if (config.extra) {
        this.modifierConfigurationCollection.extraModifierConfigurations.push(config);
      } else if (config.characterAdvancement) {
        this.modifierConfigurationCollection.advancementModifierConfigurations.push(config);
      } else {
        this.modifierConfigurationCollection.modifierConfigurations.push(config);
      }
    }
    this.configuringModifier = null;
    this.modifierConfigurationsInUse = null;
    this.addingModifier = false;
    this.configuringChange.emit(false);
  }

  deleteModifier(config: ModifierConfiguration): void {
    if (this.disabled || this.configuringModifier != null) {
      return;
    }
    const index = this.modifierConfigurationCollection.modifierConfigurations.indexOf(config);
    if (index > -1) {
      this.modifierConfigurationCollection.modifierConfigurations.splice(index, 1);
    }
  }

  deleteExtraModifier(config: ModifierConfiguration): void {
    if (this.disabled || this.configuringModifier != null) {
      return;
    }
    const index = this.modifierConfigurationCollection.extraModifierConfigurations.indexOf(config);
    if (index > -1) {
      this.modifierConfigurationCollection.extraModifierConfigurations.splice(index, 1);
    }
  }

  deleteAdvancementModifier(config: ModifierConfiguration): void {
    if (this.disabled || this.configuringModifier != null) {
      return;
    }
    const index = this.modifierConfigurationCollection.advancementModifierConfigurations.indexOf(config);
    if (index > -1) {
      this.modifierConfigurationCollection.advancementModifierConfigurations.splice(index, 1);
    }
  }

  addModifier(): void {
    if (this.disabled || this.configuringModifier != null) {
      return;
    }
    this.addingModifier = true;
    this.configuringModifier = new ModifierConfiguration();
    this.modifierConfigurationsInUse = this.modifierConfigurationCollection.modifierConfigurations;
    this.configuringChange.emit(true);
  }

  addExtraModifier(): void {
    if (this.disabled || this.configuringModifier != null) {
      return;
    }
    this.addingModifier = true;
    const modifier = new ModifierConfiguration();
    modifier.extra = true;
    this.configuringModifier = modifier;
    this.modifierConfigurationsInUse = this.modifierConfigurationCollection.extraModifierConfigurations;
    this.configuringChange.emit(true);
  }

  addAdvancementModifier(): void {
    if (this.disabled || this.configuringModifier != null) {
      return;
    }
    this.addingModifier = true;
    const modifier = new ModifierConfiguration();
    modifier.characterAdvancement = true;
    this.configuringModifier = modifier;
    this.modifierConfigurationsInUse = this.modifierConfigurationCollection.advancementModifierConfigurations;
    this.configuringChange.emit(true);
  }

  extraModifierChange(event: MatCheckboxChange): void {
    this.modifierConfigurationCollection.extraModifiers = event.checked;
  }

  advancementModifierChange(event: MatCheckboxChange): void {
    this.modifierConfigurationCollection.advancementModifiers = event.checked;
  }

  numLevelsAboveBaseChange(input): void {
    this.modifierConfigurationCollection.numLevelsAboveBase = input.value;
  }

  hasLevel(level: ListObject): boolean {
    for (let i = 0; i < this.modifierConfigurationCollection.advancementModifierConfigurations.length; i++) {
      const current = this.modifierConfigurationCollection.advancementModifierConfigurations[i];
      if (current.level.id === level.id) {
        return true;
      }
    }
    return false;
  }

  //todo -  optimize this
  getName(modifierConfiguration: ModifierConfiguration): string {
    return this.modifierService.getConfigurationDisplayName(modifierConfiguration);
  }
}
