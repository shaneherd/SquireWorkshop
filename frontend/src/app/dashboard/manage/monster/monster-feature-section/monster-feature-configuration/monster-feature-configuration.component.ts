import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Monster, MonsterFeature} from '../../../../../shared/models/creatures/monsters/monster';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {NotificationService} from '../../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';
import {ConfirmDialogData} from '../../../../../core/components/confirm-dialog/confirmDialogData';
import {ConfirmDialogComponent} from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import {DuplicateItemData} from '../../../../../core/components/duplicate-item/duplicateItemData';
import {DuplicateItemComponent} from '../../../../../core/components/duplicate-item/duplicate-item.component';
import {MonsterService} from '../../../../../core/services/creatures/monster.service';
import {LimitedUse} from '../../../../../shared/models/powers/limited-use';
import {LimitedUseType} from '../../../../../shared/models/limited-use-type.enum';
import {ListObject} from '../../../../../shared/models/list-object';
import {AbilityService} from '../../../../../core/services/attributes/ability.service';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-monster-feature-configuration',
  templateUrl: './monster-feature-configuration.component.html',
  styleUrls: ['./monster-feature-configuration.component.scss']
})
export class MonsterFeatureConfigurationComponent implements OnInit {
  @Input() monster: Monster;
  @Input() feature: MonsterFeature;
  @Input() isPublic = false;
  @Input() isShared = false;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter<MonsterFeature>();

  originalFeature: MonsterFeature;
  headerName = '';
  loading = false;
  deletable = false;
  editing = false;

  none = '';
  step = 0;

  //limited use
  abilities: ListObject[] = [];
  configuringLimitedUse: LimitedUse = null;
  limitedUse = false;
  limitedUseCategories: LimitedUseType[] = [];
  selectedLimitedUseCategory: LimitedUseType = LimitedUseType.QUANTITY;
  isQuantity = true;
  isRecharge = false;

  //modifiers
  // modifierConfigurationCollection: ModifierConfigurationCollection = new ModifierConfigurationCollection();

  configuring = false;

  constructor(
    private monsterService: MonsterService,
    private abilityService: AbilityService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.deletable = this.feature.id !== '0';
    this.headerName = this.feature.id === '0' ? this.translate.instant('Navigation.Manage.Features.New') : this.feature.name;
    this.originalFeature = _.cloneDeep(this.feature);
    this.initialize();
  }

  private initialize(): void {
    this.loading = true;
    this.editing = this.feature.id === '0';
    this.initializeAbilities();
    this.initializeLimitedUseCategories();
    this.setStep(0);
    this.updateFeature();
    this.loading = false;
  }

  closeClick(): void {
    this.close.emit();
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
    this.monsterService.deletePower(this.monster.id, this.feature).then(() => {
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
    this.monsterService.duplicatePower(this.monster.id, this.feature, name).then((id: string) => {
      this.loading = false;
      this.continue.emit();
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Duplicate');
      this.notificationService.error(translatedMessage);
    });
  }

  /************************************ Limited Use **********************************/

  private initializeLimitedUse(): void {
    if (this.feature.limitedUse == null) {
      this.feature.limitedUse = new LimitedUse();
    }
  }

  private initializeAbilities(): void {
    this.abilities = this.abilityService.getAbilitiesDetailedFromStorageAsListObject();
  }

  private initializeLimitedUseCategories(): void {
    this.limitedUseCategories = [];
    this.limitedUseCategories.push(LimitedUseType.QUANTITY);
    this.limitedUseCategories.push(LimitedUseType.RECHARGE);
  }

  changeLimitedUse(value: LimitedUseType): void {
    this.selectedLimitedUseCategory = value;
    if (this.feature.limitedUse != null) {
      this.feature.limitedUse.limitedUseType = value;
    }
    this.isQuantity = value === LimitedUseType.QUANTITY;
    this.isRecharge = value === LimitedUseType.RECHARGE;

    if (this.isRecharge && !this.loading) {
      this.feature.limitedUse.quantity = 1;
      this.feature.limitedUse.abilityModifier = '0';
      this.feature.rechargeMin = 6;
      this.feature.rechargeMax = 6;
    }
  }

  private initializeSelectedLimitedUseCategory(): void {
    this.limitedUse = this.feature.limitedUse != null;
    if (this.limitedUse) {
      this.changeLimitedUse(this.feature.limitedUse.limitedUseType);
    } else {
      this.changeLimitedUse(LimitedUseType.QUANTITY);
    }
  }

  limitedUseChange(event: MatCheckboxChange): void {
    this.limitedUse = event.checked;
    this.initializeLimitedUse();
  }

  rechargeMinChange(input): void {
    this.feature.rechargeMin = parseInt(input.value, 10);
    if (this.feature.rechargeMax < this.feature.rechargeMin) {
      this.feature.rechargeMax = this.feature.rechargeMin;
    }
  }

  rechargeMaxChange(input): void {
    this.feature.rechargeMax = parseInt(input.value, 10);
  }

  configureLimitedUse(limitedUse: LimitedUse): void {
    if (this.configuring || this.configuringLimitedUse != null) {
      return;
    }
    this.configuringLimitedUse = limitedUse;
    this.configuring = true;
  }

  limitedUseConfigurationClose(): void {
    this.configuringLimitedUse = null;
    this.configuring = false;
  }

  limitedUseConfigurationContinue(limitedUse: LimitedUse): void {
    this.configuringLimitedUse = null;
    this.configuring = false;
  }

  /************************************ End Helpers **********************************/

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
    }
  }

  updateFeature(): void {
    this.initializeSelectedLimitedUseCategory();
  }

  saveClick(): void {
    if (this.feature.name == null || this.feature.name === '') {
      this.notificationService.error(this.translate.instant('Error.NameRequired'));
      return;
    }
    if (!this.limitedUse) {
      this.feature.limitedUse = null;
    }
    if (this.feature.id == null || this.feature.id === '0') {
      this.monsterService.createPower(this.monster.id, this.feature).then((id: string) => {
        this.loading = false;
        this.feature.id = id;
        this.continue.emit(this.feature);
      }, () => {
        const translatedMessage = this.translate.instant('Error.Save');
        this.notificationService.error(translatedMessage);
        this.loading = false;
      });
    } else {
      this.monsterService.updatePower(this.monster.id, this.feature).then(() => {
        this.loading = false;
        this.continue.emit(this.feature);
      }, () => {
        const translatedMessage = this.translate.instant('Error.Save');
        this.notificationService.error(translatedMessage);
        this.loading = false;
      });
    }
  }

}
