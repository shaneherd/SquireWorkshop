import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {Feature} from '../../../../shared/models/powers/feature';
import {FeatureService} from '../../../../core/services/powers/feature.service';
import {ListObject} from '../../../../shared/models/list-object';
import {CharacteristicType} from '../../../../shared/models/characteristics/characteristic-type.enum';
import {CharacteristicService} from '../../../../core/services/characteristics/characteristic.service';
import * as _ from 'lodash';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';
import {PowerService} from '../../../../core/services/powers/power.service';
import {RangeType} from '../../../../shared/models/powers/range-type.enum';
import {RangeUnit} from '../../../../shared/models/powers/range-unit.enum';
import {ModifierConfigurationCollection} from '../../../../shared/models/modifier-configuration-collection';
import {CharacterLevelService} from '../../../../core/services/character-level.service';
import {LimitedUse} from '../../../../shared/models/powers/limited-use';
import {LimitedUseType} from '../../../../shared/models/limited-use-type.enum';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {Action} from '../../../../shared/models/action.enum';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ImportItem} from '../../../../shared/imports/import-item';
import {ImportService} from '../../../../core/services/import/import.service';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingPowerService} from '../../../../core/services/sharing/sharing-power.service';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {VersionInfo} from '../../../../shared/models/version-info';
import {EventsService} from '../../../../core/services/events.service';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportDialogService} from '../../../../core/services/export/export-dialog.service';
import {ExportPowerService} from '../../../../core/services/export/export-power.service';

@Component({
  selector: 'app-feature-info',
  templateUrl: './feature-info.component.html',
  styleUrls: ['./feature-info.component.scss']
})
export class FeatureInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public featureForm: FormGroup;
  id: string;
  feature: Feature;
  originalFeature: Feature;
  editing = false;
  itemName = '';
  cancelable = true;
  loading = false;
  none = '';

  //category
  categories: ListObject[] = [];
  selectedCategory: ListObject = new ListObject('0', '');
  characteristicLabel = '';
  characteristics: ListObject[] = [];
  selectedCharacteristic: ListObject = new ListObject('0', '');

  //levels
  levels: ListObject[] = [];
  advancementLevels: ListObject[] = [];
  selectedLevel: ListObject = new ListObject('0', '');

  //actions
  actions: Action[] = [];
  selectedAction: Action;

  //limited use
  abilities: ListObject[] = [];
  configuringLimitedUse: LimitedUse = null;
  limitedUse = false;
  limitedUseCategories: LimitedUseType[] = [];
  selectedLimitedUseCategory: LimitedUseType = LimitedUseType.QUANTITY;
  addingLimitedUse = false;
  limitedIncreaseAtHigherLevels = false;

  //range
  rangeTypes: RangeType[] = [];
  rangeUnits: RangeUnit[] = [];

  //damages
  damageConfigurationCollection: DamageConfigurationCollection = new DamageConfigurationCollection();
  originalDamageConfigurationCollection: DamageConfigurationCollection = new DamageConfigurationCollection();

  //modifiers
  modifierConfigurationCollection: ModifierConfigurationCollection = new ModifierConfigurationCollection();
  originalModifierConfigurationCollection: ModifierConfigurationCollection = new ModifierConfigurationCollection();

  configuring = false;
  routeSub: Subscription;

  importing = false;
  importItem: ImportItem = null;
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;

  constructor(
    public powerService: PowerService,
    private sharingPowerService: SharingPowerService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private featureService: FeatureService,
    private characteristicService: CharacteristicService,
    private characterLevelService: CharacterLevelService,
    private abilityService: AbilityService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private importService: ImportService,
    private exportDialogService: ExportDialogService,
    private exportDetailsService: ExportPowerService
  ) {
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.editing;
  }

  createCopyOfFeature(feature: Feature): Feature {
    return _.cloneDeep(feature);
  }

  ngOnInit() {
    this.initializeCategories();
    this.initializeLevels();
    this.initializeActions();
    this.initializeAbilities();
    this.initializeLimitedUseCategories();
    this.initializeRangeTypes();
    this.initializeRangeUnits();
    this.feature = new Feature();
    this.originalFeature = this.createCopyOfFeature(this.feature);
    this.featureForm = this.createForm();
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateFeature(new Feature());
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.Features.New');
      this.updateFeature(new Feature());
      this.loading = false;
    } else {
      this.powerService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.featureService.getFeature(this.id).then((feature: Feature) => {
        if (feature == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = feature.name;
          this.updateFeature(feature);
        }
        this.loading = false;
      });
    }
  }

  configuringChange(configuring: boolean): void {
    this.configuring = configuring;
  }

  /*********************************** Category ***********************************/

  private initializeCategories(): void {
    this.categories = [];
    this.categories.push(new ListObject('1', CharacteristicType.CLASS));
    this.categories.push(new ListObject('2', CharacteristicType.RACE));
    this.categories.push(new ListObject('3', CharacteristicType.BACKGROUND));
    this.categories.push(new ListObject('0', 'FEAT'));
  }

  getCategory(): ListObject {
    for (let i = 0; i < this.categories.length; i++) {
      const category: ListObject = this.categories[i];
      if (category.name === this.feature.characteristicType) {
        return category;
      } else if (this.feature.characteristicType == null && category.name === 'FEAT') {
        return category;
      }
    }
    return null;
  }

  changeCategory(value: ListObject): void {
    if (value == null || value.id === '0') {
      this.feature.characteristicType = null;
      this.selectedCategory = this.getCategory();
    } else {
      this.feature.characteristicType = CharacteristicType[value.name];
      this.selectedCategory = this.getCategory();
      this.characteristicLabel = this.translate.instant('CharacteristicType.' + value.name);
      this.characteristicService.getCharacteristicsByCharacteristicType(this.feature.characteristicType, true, false)
        .then((characteristics: ListObject[]) => {
          this.characteristics = characteristics;
          this.initializeSelectedCharacteristic();
        });
    }
  }

  private initializeSelectedCharacteristic(): void {
    if (this.feature.characteristic != null) {
      for (let i = 0; i < this.characteristics.length; i++) {
        const characteristic: ListObject = this.characteristics[i];
        if (characteristic.id === this.feature.characteristic.id) {
          this.selectedCharacteristic = characteristic;
          return;
        }
      }
    }
    this.defaultSelectionCharacteristic();
  }

  private defaultSelectionCharacteristic(): void {
    if (this.characteristics.length > 0) {
      this.selectedCharacteristic = this.characteristics[0];
      this.feature.characteristic = this.selectedCharacteristic;
    } else {
      this.selectedCharacteristic = new ListObject('0', '');
      this.feature.characteristic = null;
    }
  }

  characteristicChange(value: ListObject): void {
    this.selectedCharacteristic = value;
    this.feature.characteristic = value;
  }

  /************************************ Actions **********************************/

  private initializeActions(): void {
    this.actions = [];
    this.actions.push(Action.NONE);
    this.actions.push(Action.STANDARD);
    this.actions.push(Action.BONUS);
    this.actions.push(Action.REACTION);
    this.actions.push(Action.FREE);
    this.actions.push(Action.MOVE);
  }

  private initializeSelectedAction(): void {
    if (this.feature.action == null) {
      this.selectedAction = Action.NONE;
    } else {
      this.selectedAction = this.feature.action;
    }
  }

  actionChange(action: Action): void {
    this.selectedAction = action;
    if (action === Action.NONE) {
      this.feature.action = null;
    } else {
      this.feature.action = action;
    }
  }

  /************************************ Level **********************************/

  private initializeLevels(): void {
    this.none = this.translate.instant('None');
    let levels = this.characterLevelService.getLevelsDetailedFromStorageAsListObject();
    const noLevel = new ListObject('0', '');
    levels = levels.slice(0);
    levels.unshift(noLevel);
    this.levels = levels;
  }

  levelChange(value: ListObject): void {
    this.selectedLevel = value;
    if (value.id === '0') {
      this.feature.characterLevel = null;
    } else {
      this.feature.characterLevel = value;
    }
  }

  private initializeSelectedLevel(): void {
    if (this.feature.characterLevel != null) {
      for (let i = 0; i < this.levels.length; i++) {
        const level = this.levels[i];
        if (level.id === this.feature.characterLevel.id) {
          this.selectedLevel = level;
          return;
        }
      }
    }
    this.defaultSelectedLevel();
  }

  private defaultSelectedLevel(): void {
    if (this.levels.length > 0) {
      this.selectedLevel = this.levels[0];
      this.feature.characterLevel = this.selectedLevel;
    } else {
      this.selectedLevel = new ListObject('0', '');
      this.feature.characterLevel = null;
    }
  }

  passiveChange(event: MatCheckboxChange): void {
    this.feature.passive = event.checked;
  }

  /************************************ Limited Use **********************************/

  private initializeLimitedUse(): void {
    if (this.feature.limitedUses.length === 0) {
      const limitedUse: LimitedUse = new LimitedUse();
      limitedUse.characterLevel = this.levels[1];
      this.feature.limitedUses.push(limitedUse);
    }
  }

  private initializeAbilities(): void {
    this.abilities = [];
    this.abilityService.getAbilities().then().then((abilities: ListObject[]) => {
      this.abilities = abilities;
    });
  }

  private initializeLimitedUseCategories(): void {
    this.limitedUseCategories = [];
    this.limitedUseCategories.push(LimitedUseType.QUANTITY);
    this.limitedUseCategories.push(LimitedUseType.DICE);
    this.limitedUseCategories.push(LimitedUseType.LEVEL);
  }

  changeLimitedUse(value: LimitedUseType): void {
    this.selectedLimitedUseCategory = value;
    this.setLimitedUseType(value);
  }

  private setLimitedUseType(limitedUseType: LimitedUseType): void {
    for (let i = 0; i < this.feature.limitedUses.length; i++) {
      this.feature.limitedUses[i].limitedUseType = limitedUseType;
    }
  }

  initializeSelectedLimitedUseCategory(): void {
    this.limitedUse = this.feature.limitedUses.length > 0;
    this.limitedIncreaseAtHigherLevels = this.feature.limitedUses.length > 1;
    if (this.limitedUse) {
      this.selectedLimitedUseCategory = this.feature.limitedUses[0].limitedUseType;
    } else {
      this.selectedLimitedUseCategory = LimitedUseType.QUANTITY;
    }
  }

  limitedUseChange(event: MatCheckboxChange): void {
    this.limitedUse = event.checked;
    this.initializeLimitedUse();
  }

  rechargeOnShortRestChange(event: MatCheckboxChange): void {
    this.feature.rechargeOnShortRest = event.checked;
    if (event.checked) {
      this.feature.rechargeOnLongRest = true;
    }
  }

  rechargeOnLongRestChange(event: MatCheckboxChange): void {
    this.feature.rechargeOnLongRest = event.checked;
  }

  limitedIncreaseAtHigherLevelsChange(event: MatCheckboxChange): void {
    this.limitedIncreaseAtHigherLevels = event.checked;
  }

  addLimitedUse(): void {
    if (this.configuring || this.configuringLimitedUse != null) {
      return;
    }
    this.addingLimitedUse = true;
    const config = new LimitedUse();
    config.limitedUseType = this.selectedLimitedUseCategory;
    this.configuringLimitedUse = config;
    this.configuring = true;
  }

  deleteLimitedUse(limitedUse: LimitedUse): void {
    if (this.configuring || this.configuringLimitedUse != null) {
      return;
    }
    const index = this.feature.limitedUses.indexOf(limitedUse);
    if (index > -1) {
      this.feature.limitedUses.splice(index, 1);
    }
  }

  configureLimitedUse(limitedUse: LimitedUse): void {
    if (this.configuring || this.configuringLimitedUse != null) {
      return;
    }
    this.addingLimitedUse = false;
    this.configuringLimitedUse = limitedUse;
    this.configuring = true;
  }

  limitedUseConfigurationClose(): void {
    this.addingLimitedUse = false;
    this.configuringLimitedUse = null;
    this.configuring = false;
  }

  limitedUseConfigurationContinue(limitedUse: LimitedUse): void {
    if (this.addingLimitedUse) {
      this.feature.limitedUses.push(limitedUse);
      this.feature.limitedUses.sort(function(left: LimitedUse, right: LimitedUse) {
        return parseInt(left.characterLevel.name, 10) > parseInt(right.characterLevel.name, 10) ? 1 : -1;
      });
    }

    this.addingLimitedUse = false;
    this.configuringLimitedUse = null;
    this.configuring = false;
  }

  /************************************ Range **********************************/

  initializeRangeTypes(): void {
    this.rangeTypes = [];
    this.rangeTypes.push(RangeType.SELF);
    this.rangeTypes.push(RangeType.TOUCH);
    this.rangeTypes.push(RangeType.SIGHT);
    this.rangeTypes.push(RangeType.UNLIMITED);
    this.rangeTypes.push(RangeType.OTHER);
  }

  initializeRangeUnits(): void {
    this.rangeUnits = [];
    this.rangeUnits.push(RangeUnit.FEET);
    this.rangeUnits.push(RangeUnit.MILE);
  }

  isOther(): boolean {
    return this.feature.rangeType === RangeType.OTHER;
  }

  rangeTypeChange(value: RangeType): void {
    this.feature.rangeType = value;
  }

  rangeUnitChange(value: RangeUnit): void {
    this.feature.rangeUnit = value;
  }

  /************************************ End Helpers **********************************/

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  updateFeature(feature: Feature): void {
    this.feature = feature;
    this.originalFeature = this.createCopyOfFeature(this.feature);
    if (feature.characteristicType == null) {
      this.selectedCategory = new ListObject('0', '');
    } else {
      this.selectedCategory = this.getCategory();
    }
    if (feature.characteristic == null) {
      this.selectedCharacteristic = new ListObject('0', '');
    } else {
      this.selectedCharacteristic = new ListObject(feature.characteristic.id, feature.characteristic.name);
    }
    if (feature.characterLevel == null) {
      this.selectedLevel = new ListObject('0', '');
    } else {
      this.selectedLevel = feature.characterLevel;
    }
    this.featureForm.controls['name'].setValue(feature.name);
    this.featureForm.controls['description'].setValue(feature.description);
    this.featureForm.controls['range'].setValue(feature.range);
    this.featureForm.controls['prerequisite'].setValue(feature.prerequisite);
    this.changeCategory(this.getCategory());
    this.initializeSelectedLevel();
    this.initializeSelectedAction();
    this.initializeSelectedLimitedUseCategory();
    this.damageConfigurationCollection = this.powerService.initializeDamageConfigurations(feature);
    this.originalDamageConfigurationCollection =
      this.powerService.createCopyOfDamageConfigurationCollection(this.damageConfigurationCollection);

    this.modifierConfigurationCollection = this.powerService.initializeModifierConfigurations(feature);
    this.originalModifierConfigurationCollection =
      this.powerService.createCopyOfModifierConfigurationCollection(this.modifierConfigurationCollection);
    this.cd.detectChanges();
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])],
        description: [null],
        range: [null],
        prerequisite: [null]
      }
    );
  }

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }, NAVIGATION_DELAY);
  }

  save(): void {
    if (this.featureForm.valid) {
      this.loading = true;
      const values = this.featureForm.value;
      this.feature.name = values.name;
      this.feature.description = values.description;
      this.feature.range = values.range;
      this.feature.prerequisite = values.prerequisite;
      if (!this.limitedUse) {
        this.feature.limitedUses = [];
      }
      this.powerService.setDamageConfigurations(this.feature, this.damageConfigurationCollection);
      this.powerService.setModifierConfigurations(this.feature, this.modifierConfigurationCollection);
      if (this.feature.id == null || this.feature.id === '0' || this.importing) {
        this.featureService.createFeature(this.feature).then((id: string) => {
          this.id = id;
          this.feature.id = id;
          this.cancelable = true;
          this.finishSaving();
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      } else {
        this.featureService.updateFeature(this.feature).then(() => {
          this.finishSaving();
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      }
    } else {
      const translatedMessage = this.translate.instant('Error.AllFieldsRequired');
      this.notificationService.error(translatedMessage);
    }
  }

  private finishSaving(): void {
    this.itemName = this.feature.name;
    this.editing = false;
    this.updateList(this.id);
    if (!this.importing) {
      this.navigateToItem(this.id);
    } else {
      this.importService.completeItem(this.importItem, this.id);
      this.navigateToImporting();
    }
    this.loading = false;
    this.originalFeature = this.createCopyOfFeature(this.feature);
    this.originalDamageConfigurationCollection =
      this.powerService.createCopyOfDamageConfigurationCollection(this.damageConfigurationCollection);
    this.originalModifierConfigurationCollection =
      this.powerService.createCopyOfModifierConfigurationCollection(this.modifierConfigurationCollection);
  }

  private navigateToItem(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['features', id], 'side-nav': ['features', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private navigateToImporting(): void {
    this.router.navigate(['/home/dashboard',
        {outlets: {'middle-nav': ['import'], 'side-nav': ['default']}}],
      {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  delete(): void {
    this.loading = true;
    this.featureService.deleteFeature(this.feature).then(() => {
      this.loading = false;
      this.updateList(null);
      this.close();
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Delete');
      this.notificationService.error(translatedMessage);
    });
  }

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else if (this.importing) {
      this.navigateToImporting();
    } else {
      this.loading = true;
      this.feature = this.createCopyOfFeature(this.originalFeature);
      this.damageConfigurationCollection =
        this.powerService.createCopyOfDamageConfigurationCollection(this.originalDamageConfigurationCollection);
      this.modifierConfigurationCollection =
        this.powerService.createCopyOfModifierConfigurationCollection(this.originalModifierConfigurationCollection);
      this.initializeSelectedCharacteristic();
      this.initializeSelectedLevel();
      this.initializeSelectedAction();
      this.initializeSelectedLimitedUseCategory();
      this.loading = false;
    }
  }

  duplicate(name: string): void {
    this.loading = true;
    this.featureService.duplicateFeature(this.feature, name).then((id: string) => {
      this.loading = false;
      this.updateList(id);
      this.navigateToItem(id);
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Duplicate');
      this.notificationService.error(translatedMessage);
    });
  }

  private updateList(id: string): void {
    this.featureService.updateMenuItems(id);
  }

  shareClick(): void {
    this.loading = true;
    this.powerService.getPublishDetails(this.feature).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.powerService.publishPower(this.feature, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingPowerService.addToMyStuff(this.feature, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingPowerService.continueAddToMyStuff(this.feature).then((success: boolean) => {
        this.eventsService.dispatchEvent(EVENTS.AddToMyStuffFinish);
        if (success) {
          this.versionInfo.version = this.versionInfo.authorVersion;
          this.eventsService.dispatchEvent(EVENTS.VersionUpdated);
          this.notificationService.success(this.translate.instant('Success'));
          this.loading = false;
          this.initializeData();
        } else {
          this.notificationService.error(this.translate.instant('Error.Unknown'));
          this.loading = false;
        }
      });
    });
  }

  exportClick(): void {
    const item = new ManageListItem();
    item.listObject = new ListObject(this.feature.id, this.feature.name, this.feature.sid, this.feature.author);
    item.menuItem = new MenuItem(this.feature.id, this.feature.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, false, this.exportDetailsService, 'Features', () => {}, this.feature);
  }
}
