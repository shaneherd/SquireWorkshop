import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Feature} from '../../../../shared/models/powers/feature';
import {TranslateService} from '@ngx-translate/core';
import {ListObject} from '../../../../shared/models/list-object';
import {Action} from '../../../../shared/models/action.enum';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {LimitedUse} from '../../../../shared/models/powers/limited-use';
import {LimitedUseType} from '../../../../shared/models/limited-use-type.enum';
import {RangeType} from '../../../../shared/models/powers/range-type.enum';
import {RangeUnit} from '../../../../shared/models/powers/range-unit.enum';
import {PowerService} from '../../../../core/services/powers/power.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FeatureService} from '../../../../core/services/powers/feature.service';
import {CharacteristicService} from '../../../../core/services/characteristics/characteristic.service';
import {CharacterLevelService} from '../../../../core/services/character-level.service';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {FormBuilder} from '@angular/forms';
import {ResolutionService} from '../../../../core/services/resolution.service';
import {NotificationService} from '../../../../core/services/notification.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';
import {ModifierConfigurationCollection} from '../../../../shared/models/modifier-configuration-collection';
import {DuplicateItemData} from '../../../../core/components/duplicate-item/duplicateItemData';
import {DuplicateItemComponent} from '../../../../core/components/duplicate-item/duplicate-item.component';
import {InUse} from '../../../../shared/models/inUse/in-use';
import {ConfirmDialogData} from '../../../../core/components/confirm-dialog/confirmDialogData';
import {ConfirmDialogComponent} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import {InUseDialogData} from '../../../../core/components/in-use-dialog/in-use-dialog-data';
import {InUseDialogComponent} from '../../../../core/components/in-use-dialog/in-use-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-feature-configuration',
  templateUrl: './feature-configuration.component.html',
  styleUrls: ['./feature-configuration.component.scss']
})
export class FeatureConfigurationComponent implements OnInit {
  @Input() feature: Feature;
  @Input() isPublic = false;
  @Input() isShared = false;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter<Feature>();

  originalFeature: Feature;
  headerName = '';
  step = 0;
  loading = false;
  deletable = false;
  editing = false;

  none = '';

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

  //modifiers
  modifierConfigurationCollection: ModifierConfigurationCollection = new ModifierConfigurationCollection();

  configuring = false;

  constructor(
    private powerService: PowerService,
    private route: ActivatedRoute,
    private featureService: FeatureService,
    private characteristicService: CharacteristicService,
    private characterLevelService: CharacterLevelService,
    private abilityService: AbilityService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private resolutionService: ResolutionService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.deletable = this.feature.id !== '0';
    this.originalFeature = _.cloneDeep(this.feature);
    this.initialize();
  }

  private initialize(): void {
    this.editing = this.feature.id === '0';
    this.initializeLevels();
    this.initializeActions();
    this.initializeAbilities();
    this.initializeLimitedUseCategories();
    this.initializeRangeTypes();
    this.initializeRangeUnits();
    this.updateFeature();
    this.setStep(0);
  }

  closeClick(): void {
    this.close.emit();
  }

  setStep(step: number): void {
    this.step = step;
    switch (this.step) {
      case 0:
        if (this.editing) {
          this.headerName = this.translate.instant('Headers.BasicInfo');
        } else {
          this.headerName = this.feature.name;
        }
        break;
      case 1:
        this.headerName = this.translate.instant('Headers.LimitedUse');
        break;
      case 2:
        this.headerName = this.translate.instant('Headers.Damages');
        break;
      case 3:
        this.headerName = this.translate.instant('Headers.Modifiers');
        break;
    }
  }

  primaryClick(): void {
    if (this.editing) {
      this.saveClick();
    } else {
      this.editing = true;
    }
  }

  secondaryClick(): void {
    if (!this.editing || this.feature.id === '0') {
      this.closeClick();
    } else {
      this.cancelClick();
    }
  }

  cancelClick(): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Headers.CancelChanges');
    data.message = this.translate.instant('Navigation.Manage.CancelMessage');
    data.confirm = () => {
      self.feature = _.cloneDeep(self.originalFeature);
      self.initialize();
      self.editing = false;
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  tertiaryClick(): void {
    if (this.editing) {
      this.deleteClick();
    } else {
      this.duplicateClick();
    }
  }

  private deleteClick(): void {
    this.powerService.inUse(this.feature.id).then((inUse: InUse[]) => {
      if (inUse.length === 0) {
        this.confirmDelete();
      } else {
        this.showInUse(inUse);
      }
    });
  }

  private showInUse(inUse: InUse[]): void {
    const self = this;
    const data = new InUseDialogData();
    data.name = this.feature.name;
    data.type = this.translate.instant('PowerType.FEATURE');
    data.confirm = () => {
      self.continueDelete();
    };
    data.inUse = inUse;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(InUseDialogComponent, dialogConfig);
  }

  private confirmDelete(): void {
    const self = this;
    const data = new ConfirmDialogData();
    data.title = this.translate.instant('Headers.ConfirmDelete');
    data.message = this.translate.instant('Navigation.Manage.ConfirmDelete');
    data.confirm = () => {
      self.continueDelete();
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ConfirmDialogComponent, dialogConfig);
  }

  private continueDelete(): void {
    this.loading = true;
    this.featureService.deleteFeature(this.feature).then(() => {
      this.loading = false;
      this.continue.emit();
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Delete');
      this.notificationService.error(translatedMessage);
    });
  }

  private duplicateClick(): void {
    const self = this;
    const data = new DuplicateItemData();
    data.message = this.translate.instant('Navigation.Manage.DuplicateMessage');
    data.defaultName = this.feature.name + ' (Copy)';
    data.confirm = (name: string) => {
      self.continueDuplicate(name);
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(DuplicateItemComponent, dialogConfig);
  }

  private continueDuplicate(name: string): void {
    this.loading = true;
    this.featureService.duplicateFeature(this.feature, name).then((id: string) => {
      this.loading = false;
      this.continue.emit();
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Duplicate');
      this.notificationService.error(translatedMessage);
    });
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
    this.advancementLevels = levels.slice(0);

    const noLevel = new ListObject('0', '');
    levels = levels.slice(0);
    levels.unshift(noLevel);
    this.levels = levels;

    this.initializeSelectedLevel();
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
          this.levelChange(level);
          return;
        }
      }
    }
    this.defaultSelectedLevel();
  }

  private defaultSelectedLevel(): void {
    if (this.levels.length > 0) {
      this.levelChange(this.levels[0]);
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

  updateFeature(): void {
    this.initializeSelectedAction();
    this.initializeSelectedLimitedUseCategory();
    this.damageConfigurationCollection = this.powerService.initializeDamageConfigurations(this.feature);
    this.modifierConfigurationCollection = this.powerService.initializeModifierConfigurations(this.feature);
    this.cd.detectChanges();
  }

  saveClick(): void {
    if (this.feature.name == null || this.feature.name === '') {
      this.notificationService.error(this.translate.instant('Error.NameRequired'));
      return;
    }
    if (!this.limitedUse) {
      this.feature.limitedUses = [];
    }
    this.powerService.setDamageConfigurations(this.feature, this.damageConfigurationCollection);
    this.powerService.setModifierConfigurations(this.feature, this.modifierConfigurationCollection);
    if (this.feature.id == null || this.feature.id === '0') {
      this.featureService.createFeature(this.feature).then((id: string) => {
        this.loading = false;
        this.feature.id = id;
        this.continue.emit(this.feature);
      }, () => {
        const translatedMessage = this.translate.instant('Error.Save');
        this.notificationService.error(translatedMessage);
        this.loading = false;
      });
    } else {
      this.featureService.updateFeature(this.feature).then(() => {
        this.loading = false;
        this.continue.emit(this.feature);
      }, () => {
        const translatedMessage = this.translate.instant('Error.Save');
        this.notificationService.error(translatedMessage);
        this.loading = false;
      });
    }
  }

  // delete(): void {
  //   this.loading = true;
  //   this.featureService.deleteFeature(this.feature).then(() => {
  //     this.loading = false;
  //     this.continue.emit(this.feature);
  //   }, () => {
  //     this.loading = false;
  //     const translatedMessage = this.translate.instant('Error.Delete');
  //     this.notificationService.error(translatedMessage);
  //   });
  // }

  // duplicate(name: string): void {
  //   this.loading = true;
  //   this.featureService.duplicateFeature(this.feature, name).then((id: string) => {
  //     this.loading = false;
  //     this.continue.emit(this.feature);
  //   }, () => {
  //     this.loading = false;
  //     const translatedMessage = this.translate.instant('Error.Duplicate');
  //     this.notificationService.error(translatedMessage);
  //   });
  // }
}
