import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {
  CharacterValidationConfigurationASI,
  CharacterValidationItem, CharacterValidationResponse,
  CharacterValidationResponseItem, CharacterValidationWarning
} from '../../../../shared/models/creatures/characters/character-validation';
import {FeatureListObject} from '../../../../shared/models/powers/feature-list-object';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FeatureMenuItem} from '../../../selection-list/features-selection-list/features-selection-list.component';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {ValidateCharacterIgnoreFeaturesDialogData} from '../../../../core/components/validate-character-ignore-features-dialog/validate-character-ignore-features-dialog-data';
import {
  ValidateCharacterIgnoreFeaturesDialogComponent
} from '../../../../core/components/validate-character-ignore-features-dialog/validate-character-ignore-features-dialog.component';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {SpellListObject} from '../../../../shared/models/powers/spell-list-object';
import {SpellMenuItem} from '../../../selection-list/spell-selection-list/spell-selection-list.component';
import {CreatureSpell} from '../../../../shared/models/creatures/creature-spell';
import {BarTagService} from '../../../../core/services/bar-tag.service';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';

export class CharacterValidationConfiguration {
  characterValidationItem: CharacterValidationItem = new CharacterValidationItem();
  features: FeatureMenuItem[] = [];
  spells: SpellMenuItem[] = [];
  ignoreUnselectedFeatures = false;
  ignoreUnselectedSpells = false;
  ignoreASI = false;
  feat: FeatureListObject;
  abilityScoreIncreases: CharacterValidationConfigurationASI[] = [];
  disableFeatSelection = false;
  disableASISelection = false;
}

@Component({
  selector: 'app-validate-character',
  templateUrl: './validate-character.component.html',
  styleUrls: ['./validate-character.component.scss']
})
export class ValidateCharacterComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter();

  loading = false;
  step = 0;
  pages: CharacterValidationConfiguration[] = [];
  currentPage: CharacterValidationConfiguration = new CharacterValidationConfiguration();
  validationItems: CharacterValidationItem[] = [];
  viewingFeature: FeatureMenuItem;
  viewingSpell: SpellMenuItem;
  selectedFeatureCount = 0;
  selectedSpellCount = 0;

  configuringASI = false;
  selectingFeat = false;
  configuring = false;
  eventSub: Subscription;

  constructor(
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private dialog: MatDialog,
    private barTagService: BarTagService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.loading = true;
    this.characterService.validateCharacter(this.playerCharacter).then((items: CharacterValidationItem[]) => {
      this.validationItems = items;
      if (items.length === 0) {
        this.pages = [];
      } else {
        this.initializeValidationScreens();
      }
      this.loading = false;
    });

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.FeatureTagsUpdated) {
        this.updateFeatureTags();
      } else if (event === EVENTS.SpellTagsUpdated) {
        this.updateSpellTags();
      }
    });
  }

  private updateFeatureTags(): void {
    this.pages.forEach((page: CharacterValidationConfiguration) => {
      page.features.forEach((menuItem: FeatureMenuItem) => {
        menuItem.tags = this.barTagService.initializeTags(menuItem.feature.tags, this.playerCharacter.creatureFeatures.tags);
      });
    });
  }

  private updateSpellTags(): void {
    this.pages.forEach((page: CharacterValidationConfiguration) => {
      page.spells.forEach((menuItem: SpellMenuItem) => {
        menuItem.tags = this.barTagService.initializeTags(menuItem.spell.tags, this.playerCharacter.creatureSpellCasting.tags);
      });
    });
  }

  private initializeValidationScreens(): void {
    const pages: CharacterValidationConfiguration[] = [];
    this.validationItems.forEach((item: CharacterValidationItem) => {
      if (item.abilityScoreIncreaseApplicable && !item.abilityScoreIncreaseApplied && !item.featSelected) {
        const asiPage = new CharacterValidationConfiguration();
        asiPage.characterValidationItem = item;
        asiPage.ignoreASI = this.playerCharacter.characterSettings.validation.autoIgnoreUnselectedAsi;
        pages.push(asiPage);
      }

      if (item.features.length > 0) {
        const featurePage = new CharacterValidationConfiguration();
        featurePage.characterValidationItem = item;
        featurePage.ignoreUnselectedFeatures = this.playerCharacter.characterSettings.validation.autoIgnoreUnselectedFeatures;
        item.features.forEach((feature: FeatureListObject) => {
          const menuItem = new FeatureMenuItem(feature);
          menuItem.tags = this.barTagService.initializeTags(feature.tags, this.playerCharacter.creatureFeatures.tags);
          featurePage.features.push(menuItem);
        });
        pages.push(featurePage);
      }

      if (item.spells.length > 0) {
        const spellPage = new CharacterValidationConfiguration();
        spellPage.characterValidationItem = item;
        spellPage.ignoreUnselectedSpells = this.playerCharacter.characterSettings.validation.autoIgnoreUnselectedSpells;
        item.spells.forEach((spell: SpellListObject) => {
          const menuItem = new SpellMenuItem(spell);
          menuItem.tags = this.barTagService.initializeTags(spell.tags, this.playerCharacter.creatureSpellCasting.tags);
          spellPage.spells.push(menuItem);
        });
        pages.push(spellPage);
      }
    });
    this.pages = pages;
    this.setStep(0);
  }

  setStep(step: number): void {
    if (step < 0 || step > this.pages.length - 1) {
      return;
    }
    this.step = step;
    this.currentPage = this.pages[step];
    this.updateSelectedFeatureCount();
  }

  featureClick(featureMenuItem: FeatureMenuItem): void {
    this.viewingFeature = featureMenuItem;
  }

  featureCheckChange(featureMenuItem: FeatureMenuItem): void {
    this.updateSelectedFeatureCount();
  }

  toggleFeatureSelected(feature: FeatureMenuItem): void {
    feature.selected = !feature.selected;
    this.viewingFeature = null;
    this.updateSelectedFeatureCount();
  }

  addFeatureClose(): void {
    this.viewingFeature = null;
  }

  spellClick(spellMenuItem: SpellMenuItem): void {
    this.viewingSpell = spellMenuItem;
  }

  spellCheckChange(spellMenuItem: SpellMenuItem): void {
    this.updateSelectedFeatureCount();
  }

  toggleSpellSelected(spellMenuItem: SpellMenuItem): void {
    spellMenuItem.selected = !spellMenuItem.selected;
    this.viewingSpell = null;
    this.updateSelectedSpellCount();
  }

  addSpellClose(): void {
    this.viewingSpell = null;
  }

  private getIgnoredFeatures(): FeatureListObject[] {
    const ignoredFeatures: FeatureListObject[] = [];
    this.pages.forEach((page: CharacterValidationConfiguration) => {
      if (page.ignoreUnselectedFeatures) {
        page.features.forEach((featureMenuItem: FeatureMenuItem) => {
          if (!featureMenuItem.selected) {
            ignoredFeatures.push(featureMenuItem.feature);
          }
        });
      }
    });
    return ignoredFeatures;
  }

  private getIgnoredSpells(): SpellListObject[] {
    const ignoredSpells: SpellListObject[] = [];
    this.pages.forEach((page: CharacterValidationConfiguration) => {
      if (page.ignoreUnselectedSpells) {
        page.spells.forEach((spellMenuItem: SpellMenuItem) => {
          if (!spellMenuItem.selected) {
            ignoredSpells.push(spellMenuItem.spell);
          }
        });
      }
    });
    return ignoredSpells;
  }

  private getAllSelectedFeatures(): FeatureListObject[] {
    let features: FeatureListObject[] = [];
    this.pages.forEach((page: CharacterValidationConfiguration) => {
      features = features.concat(this.getSelectedFeatures(page));
      if (page.feat != null) {
        features.push(page.feat);
      }
    });
    return features;
  }

  private getAllSelectedSpells(): CreatureSpell[] {
    let spells: CreatureSpell[] = [];
    this.pages.forEach((page: CharacterValidationConfiguration) => {
      spells = spells.concat(this.getSelectedSpells(page));
    });
    return spells;
  }

  private getSelectedFeatures(page: CharacterValidationConfiguration): FeatureListObject[] {
    const features: FeatureListObject[] = [];
    page.features.forEach((featureMenuItem: FeatureMenuItem) => {
      if (featureMenuItem.selected) {
        features.push(featureMenuItem.feature);
      }
    });
    return features;
  }

  private getSelectedSpells(page: CharacterValidationConfiguration): CreatureSpell[] {
    const spells: CreatureSpell[] = [];
    page.spells.forEach((spellMenuItem: SpellMenuItem) => {
      if (spellMenuItem.selected) {
        const creatureSpell = new CreatureSpell();
        creatureSpell.spell = spellMenuItem.spell;
        creatureSpell.assignedCharacteristic = page.characterValidationItem.characteristic.id;
        spells.push(creatureSpell);
      }
    });
    return spells;
  }

  configureASI(): void {
    this.configuringASI = true;
  }

  saveASI(): void {
    this.configuringASI = false;
    if (this.playerCharacter.characterSettings.validation.asiFeatOneOnly) {
      this.currentPage.disableFeatSelection = this.currentPage.abilityScoreIncreases.length > 0;
    }
  }

  closeASI(): void {
    this.configuringASI = false;
  }

  selectFeat(): void {
    this.selectingFeat = true;
  }

  saveFeatSelection(): void {
    this.selectingFeat = false;
    if (this.playerCharacter.characterSettings.validation.asiFeatOneOnly) {
      this.currentPage.disableASISelection = this.currentPage.feat != null;
    }
  }

  closeFeatSelection(): void {
    this.selectingFeat = false;
  }

  closeDetails(): void {
    this.close.emit();
  }

  selectAllClick(): void {
    if (this.currentPage.features.length > 0) {
      const selected = this.selectedFeatureCount === 0;
      this.currentPage.features.forEach((feature: FeatureMenuItem) => {
        feature.selected = selected;
      });
      this.updateSelectedFeatureCount();
    } else if (this.currentPage.spells.length > 0) {
      const selected = this.selectedSpellCount === 0;
      this.currentPage.spells.forEach((spell: SpellMenuItem) => {
        spell.selected = selected;
      });
      this.updateSelectedSpellCount();
    }
  }

  private updateSelectedFeatureCount(): void {
    this.selectedFeatureCount = this.getSelectedFeatures(this.currentPage).length;
  }

  private updateSelectedSpellCount(): void {
    this.selectedSpellCount = this.getSelectedSpells(this.currentPage).length;
  }

  ignoreFeaturesChange(event: MatCheckboxChange): void {
    this.currentPage.ignoreUnselectedFeatures = event.checked;
  }

  ignoreSpellsChange(event: MatCheckboxChange): void {
    this.currentPage.ignoreUnselectedSpells = event.checked;
  }

  ignoreAsiChange(event: MatCheckboxChange): void {
    this.currentPage.ignoreASI = event.checked;
  }

  saveClick(): void {
    const warnings = this.getWarnings();
    if (warnings.length > 0) {
      this.showWarnings(warnings);
    } else {
      this.continueSave();
    }
  }

  private getWarnings(): CharacterValidationWarning[] {
    const warnings: CharacterValidationWarning[] = [];
    this.pages.forEach((page: CharacterValidationConfiguration, index: number) => {
      const warning = new CharacterValidationWarning();
      warning.item = page.characterValidationItem;
      warning.pageIndex = index;

      if (page.features.length > 0 && !page.ignoreUnselectedFeatures) {
        const featuresSelectedCount = this.getSelectedFeatures(page).length;
        if (featuresSelectedCount === 0) {
          warning.noFeaturesSelected = true;
        } else if (featuresSelectedCount < page.characterValidationItem.features.length && !page.ignoreUnselectedFeatures) {
          warning.missingFeatures = true;
        }
      }

      if (page.spells.length > 0 && !page.ignoreUnselectedSpells) {
        const spellsSelectedCount = this.getSelectedSpells(page).length;
        if (spellsSelectedCount === 0) {
          warning.noSpellsSelected = true;
        } else if (spellsSelectedCount < page.characterValidationItem.spells.length && !page.ignoreUnselectedSpells) {
          warning.missingSpells = true;
        }
      }

      if (page.features.length === 0 && page.spells.length === 0 && page.characterValidationItem.abilityScoreIncreaseApplicable && !page.ignoreASI) {
        const totalASI = this.getTotalASI(page);
        const pointsAllowed = 2;
        if (this.playerCharacter.characterSettings.validation.allowFeatSelection) {
          if (this.playerCharacter.characterSettings.validation.asiFeatOneOnly) {
            if (page.feat == null && totalASI < pointsAllowed) {
              warning.missingASI = true;
              warning.missingFeat = true;
            }
          } else {
            if (page.feat == null && totalASI === 0) {
              warning.missingASI = true;
              warning.missingFeat = true;
            } else if (totalASI < pointsAllowed) {
              warning.missingASI = true;
            }
          }
        } else {
          if (totalASI < pointsAllowed) {
            warning.missingASI = true;
          }
        }
      }

      if (warning.noFeaturesSelected || warning.missingFeatures || warning.noSpellsSelected || warning.missingSpells || warning.missingASI || warning.missingFeat) {
        warnings.push(warning);
      }
    });
    return warnings;
  }

  private getTotalASI(page: CharacterValidationConfiguration): number {
    let total = 0;
    page.abilityScoreIncreases.forEach((asi: CharacterValidationConfigurationASI) => {
      total += asi.amount;
    });
    return total;
  }

  private showWarnings(warnings: CharacterValidationWarning[]): void {
    const data = new ValidateCharacterIgnoreFeaturesDialogData();
    data.warnings = warnings;
    data.hasMultiplePages = this.pages.length > 1;
    data.autoIgnoreUnselectedFeatures = this.playerCharacter.characterSettings.validation.autoIgnoreUnselectedFeatures;
    data.autoIgnoreUnselectedSpells = this.playerCharacter.characterSettings.validation.autoIgnoreUnselectedSpells;
    data.autoIgnoreUnselectedAsi = this.playerCharacter.characterSettings.validation.autoIgnoreUnselectedAsi;
    data.continue = (ignoreUnselectedFeatures: boolean, ignoreUnselectedSpells: boolean, ignoreUnselectedAsi: boolean) => {
      if (ignoreUnselectedFeatures || ignoreUnselectedSpells || ignoreUnselectedAsi) {
        this.pages.forEach((page: CharacterValidationConfiguration) => {
          page.ignoreUnselectedFeatures = ignoreUnselectedFeatures;
          page.ignoreUnselectedSpells = ignoreUnselectedSpells;
          page.ignoreASI = ignoreUnselectedAsi;
        });
      }
      this.continueSave();
    };
    data.goToPage = (index: number) => {
      if (index > -1 && index <= this.pages.length - 1) {
        this.setStep(index);
      }
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ValidateCharacterIgnoreFeaturesDialogComponent, dialogConfig);
  }

  private continueSave(): void {
    const ignoredFeatures = this.getIgnoredFeatures();
    const ignoredSpells = this.getIgnoredSpells();
    const response = new CharacterValidationResponse();
    response.ignoredFeatures = ignoredFeatures;
    response.ignoredSpells = ignoredSpells;
    response.items = this.getResponseItems();

    const features: FeatureListObject[] = this.getAllSelectedFeatures();
    const spells: CreatureSpell[] = this.getAllSelectedSpells();

    const promises: Promise<any>[] = [];
    promises.push(this.creatureService.updateCreatureValidation(this.playerCharacter, response));
    promises.push(this.characterService.addFeatures(this.playerCharacter, features, this.collection));
    promises.push(this.characterService.addSpells(this.playerCharacter, spells, this.collection));
    Promise.all(promises).then(() => {
      this.continue.emit();
    });
  }

  private getResponseItems(): CharacterValidationResponseItem[] {
    const responseItems: CharacterValidationResponseItem[] = [];
    this.pages.forEach((page: CharacterValidationConfiguration) => {
      const responseItem = new CharacterValidationResponseItem();
      responseItem.characterValidationItem = page.characterValidationItem;
      responseItem.selectedFeat = page.feat;
      responseItem.ignoreASI = page.ignoreASI;
      responseItem.selectedAbilityScoreIncreases = page.abilityScoreIncreases;
      responseItems.push(responseItem);
    });
    return responseItems;
  }

  configure(): void {
    this.configuring = true;
  }

  saveConfiguration(reset: boolean): void {
    this.configuring = false;
    if (!reset) {
      this.pages.forEach((page: CharacterValidationConfiguration) => {
        page.ignoreUnselectedFeatures = this.playerCharacter.characterSettings.validation.autoIgnoreUnselectedFeatures;
        page.ignoreASI = this.playerCharacter.characterSettings.validation.autoIgnoreUnselectedAsi;
        if (page.characterValidationItem.abilityScoreIncreaseApplicable) {
          if (this.playerCharacter.characterSettings.validation.allowFeatSelection) {
            if (this.playerCharacter.characterSettings.validation.asiFeatOneOnly) {
              page.disableFeatSelection = page.abilityScoreIncreases.length > 0;
              if (page.disableFeatSelection) {
                page.feat = null;
              } else {
                page.disableASISelection = page.feat != null;
              }
            } else {
              page.disableASISelection = false;
              page.disableFeatSelection = false;
            }
          } else {
            page.feat = null;
          }
        }
      });
    } else {
      this.loading = true;
      this.characterService.resetIgnoredFeatures(this.playerCharacter).then(() => {
        this.initializeValues();
      });
    }
  }

  cancelConfiguration(): void {
    this.configuring = false;
  }
}
