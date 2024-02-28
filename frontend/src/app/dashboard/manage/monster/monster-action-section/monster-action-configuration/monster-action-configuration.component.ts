import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Monster, MonsterAction} from '../../../../../shared/models/creatures/monsters/monster';
import {MonsterService} from '../../../../../core/services/creatures/monster.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {NotificationService} from '../../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';
import {ConfirmDialogData} from '../../../../../core/components/confirm-dialog/confirmDialogData';
import {ConfirmDialogComponent} from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import {DuplicateItemData} from '../../../../../core/components/duplicate-item/duplicateItemData';
import {DuplicateItemComponent} from '../../../../../core/components/duplicate-item/duplicate-item.component';
import {ListObject} from '../../../../../shared/models/list-object';
import {LimitedUse} from '../../../../../shared/models/powers/limited-use';
import {LimitedUseType} from '../../../../../shared/models/limited-use-type.enum';
import {AbilityService} from '../../../../../core/services/attributes/ability.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {AttackType} from '../../../../../shared/models/attack-type.enum';
import {DamageConfiguration} from '../../../../../shared/models/damage-configuration';
import {DamageConfigurationCollection} from '../../../../../shared/models/damage-configuration-collection';
import {WeaponRangeType} from '../../../../../shared/models/items/weapon-range-type.enum';
import {ItemListObject} from '../../../../../shared/models/items/item-list-object';
import {ItemService} from '../../../../../core/services/items/item.service';
import {Action} from '../../../../../shared/models/action.enum';

@Component({
  selector: 'app-monster-action-configuration',
  templateUrl: './monster-action-configuration.component.html',
  styleUrls: ['./monster-action-configuration.component.scss']
})
export class MonsterActionConfigurationComponent implements OnInit {
  @Input() monster: Monster;
  @Input() action: MonsterAction;
  @Input() isPublic = false;
  @Input() isShared = false;
  @Output() close = new EventEmitter();
  @Output() continue = new EventEmitter<MonsterAction>();

  originalAction: MonsterAction;
  headerName = '';
  loading = false;
  deletable = false;
  editing = false;

  none = '';
  step = 0;
  abilities: ListObject[] = [];
  abilitiesFull: ListObject[] = [];

  //action type
  actionTypes: Action[] = [];
  isLegendary = false;
  selectedAction: Action;

  //attack
  attack = false;
  rangeTypes: WeaponRangeType[] = [];
  isRanged = false;
  ammoTypes: ItemListObject[] = [];
  selectedAmmoType: ItemListObject;
  attackTypes: AttackType[] = [];
  isAttack = false;
  isSave = false;
  isHeal = false;
  selectedAttackAbilityModifier = '';
  selectedSaveAbilityModifier = '';

  //damage
  addingDamage = false;
  configuringDamage: DamageConfiguration = null;
  damageConfigurationCollection: DamageConfigurationCollection = new DamageConfigurationCollection();
  originalDamageConfigurationCollection: DamageConfigurationCollection = new DamageConfigurationCollection();

  //limited use
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
    private translate: TranslateService,
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.deletable = this.action.id !== '0';
    this.headerName = this.action.id === '0' ? this.translate.instant('Navigation.Manage.Actions.New') : this.action.name;
    this.originalAction = _.cloneDeep(this.action);
    this.initialize();
  }

  private initialize(): void {
    this.loading = true;
    this.editing = this.action.id === '0';
    this.none = this.translate.instant('None');
    this.initializeActionTypes();
    this.initializeAbilities();
    this.initializeLimitedUseCategories();
    this.initializeRangeTypes();
    this.initializeAmmoTypes();
    this.initializeAttackTypes();
    this.setStep(0);
    this.updateAction();
    this.loading = false;
  }

  private initializeActionTypes(): void {
    this.actionTypes = [];
    this.actionTypes.push(Action.STANDARD);
    this.actionTypes.push(Action.BONUS);
    this.actionTypes.push(Action.REACTION);
    this.actionTypes.push(Action.FREE);
    this.actionTypes.push(Action.MOVE);
    this.actionTypes.push(Action.LEGENDARY);
    this.actionTypes.push(Action.LAIR);

    this.initializeSelectedAction();
  }

  private initializeSelectedAction(): void {
    if (this.action.actionType == null) {
      this.selectedAction = Action.NONE;
    } else {
      this.selectedAction = this.action.actionType;
      this.isLegendary = this.selectedAction === 'LEGENDARY';
    }
  }

  actionTypeChange(value: Action): void {
    this.action.actionType = value;
    this.isLegendary = value === 'LEGENDARY';
  }

  legendaryCostChange(input): void {
    this.action.legendaryCost = parseInt(input.value, 10);
  }

  private initializeAbilities(): void {
    this.abilities = this.abilityService.getAbilitiesDetailedFromStorageAsListObject();
    this.abilitiesFull = this.abilityService.getAbilitiesDetailedFromStorageAsListObject();
    const noAbility = new ListObject('0', '');
    this.abilitiesFull.unshift(noAbility);
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
    if (!this.editing || this.action.id === '0') {
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
      self.action = _.cloneDeep(self.originalAction);
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
    this.monsterService.deletePower(this.monster.id, this.action).then(() => {
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
    data.defaultName = this.action.name + ' (Copy)';
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
    this.monsterService.duplicatePower(this.monster.id, this.action, name).then((id: string) => {
      this.loading = false;
      this.continue.emit();
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Duplicate');
      this.notificationService.error(translatedMessage);
    });
  }

  /************************************ Attack **********************************/

  private initializeRangeTypes(): void {
    this.rangeTypes = [];
    this.rangeTypes.push(WeaponRangeType.MELEE);
    this.rangeTypes.push(WeaponRangeType.RANGED);
    this.isRanged = this.action.rangeType === WeaponRangeType.RANGED;
  }

  private initializeAmmoTypes(): void {
    this.ammoTypes = [];
    this.itemService.getAmmos().then((ammoTypes: ItemListObject[]) => {
      const none = new ItemListObject('0', this.translate.instant('None'));
      ammoTypes.unshift(none);
      this.ammoTypes = ammoTypes;
      this.initializeSelectedAmmoType();
    });
  }

  private initializeSelectedAmmoType(): void {
    if (this.action.ammoType != null) {
      for (let i = 0; i < this.ammoTypes.length; i++) {
        const ammoType: ItemListObject = this.ammoTypes[i];
        if (this.action.ammoType.id === ammoType.id) {
          this.selectedAmmoType = ammoType;
          return;
        }
      }
    }

    if ((this.editing || this.action.ammoType == null) && this.ammoTypes.length > 0) {
      this.ammoTypeChange(this.ammoTypes[0]);
    }
  }

  private initializeAttackTypes(): void {
    this.attackTypes = [];
    this.attackTypes.push(AttackType.NONE);
    this.attackTypes.push(AttackType.ATTACK);
    this.attackTypes.push(AttackType.SAVE);
    this.attackTypes.push(AttackType.HEAL);
  }

  private initializeSelectedAttackAbilityModifier(): void {
    for (let i = 0; i < this.abilities.length; i++) {
      if (this.abilities[i].id === this.damageConfigurationCollection.attackAbilityMod) {
        this.selectedAttackAbilityModifier = this.abilities[i].name;
        return;
      }
    }
  }

  private initializeSelectedSaveAbilityModifier(): void {
    for (let i = 0; i < this.abilities.length; i++) {
      if (this.abilities[i].id === this.damageConfigurationCollection.saveAbilityModifier) {
        this.selectedSaveAbilityModifier = this.abilities[i].name;
        return;
      }
    }
  }

  rangeTypeChange(value: WeaponRangeType): void {
    this.action.rangeType = value;
    this.isRanged = value === WeaponRangeType.RANGED;
  }

  reachChange(input): void {
    this.action.reach = parseInt(input.value, 10);
  }

  normalRangeChange(input): void {
    this.action.normalRange = parseInt(input.value, 10);
  }

  longRangeChange(input): void {
    this.action.longRange = parseInt(input.value, 10);
  }

  ammoTypeChange(value: ItemListObject): void {
    this.selectedAmmoType = value;
    this.action.ammoType = new ListObject(value.id, value.name, value.sid);
  }

  attackTypeChange(value: AttackType): void {
    this.damageConfigurationCollection.attackType = value;
    this.attack = value !== AttackType.NONE;
    this.isAttack = value === AttackType.ATTACK;
    this.isSave = value === AttackType.SAVE;
    this.isHeal = value === AttackType.HEAL;
    this.updateHealing(this.isHeal, this.damageConfigurationCollection.damageConfigurations);
  }

  private updateHealing(healing: boolean, configs: DamageConfiguration[]): void {
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

  halfOnSaveChange(event: MatCheckboxChange): void {
    this.damageConfigurationCollection.halfOnSave = event.checked;
  }

  temporaryHPChange(event: MatCheckboxChange): void {
    this.damageConfigurationCollection.temporaryHP = event.checked;
  }

  abilityChange(value: string): void {
    this.damageConfigurationCollection.saveType = this.getAbility(value);
  }

  private getAbility(id: string): ListObject {
    for (let i = 0; i < this.abilities.length; i++) {
      const ability: ListObject = this.abilities[i];
      if (ability.id === id) {
        return ability;
      }
    }
    return null;
  }

  /************************************ Damage **********************************/

  addDamage(): void {
    if (this.configuringDamage != null) {
      return;
    }
    this.addingDamage = true;
    const damage = new DamageConfiguration();
    damage.healing = this.damageConfigurationCollection.attackType === AttackType.HEAL;
    this.configuringDamage = damage;
  }

  configureDamage(config: DamageConfiguration): void {
    if (this.configuringDamage != null) {
      return;
    }
    this.addingDamage = false;
    this.configuringDamage = config;
  }

  deleteDamage(config: DamageConfiguration): void {
    if (this.configuringDamage != null) {
      return;
    }
    const index = this.damageConfigurationCollection.damageConfigurations.indexOf(config);
    if (index > -1) {
      this.damageConfigurationCollection.damageConfigurations.splice(index, 1);
    }
  }

  damageConfigurationClose(): void {
    this.configuringDamage = null;
    this.addingDamage = false;
  }

  damageConfigurationContinue(config: DamageConfiguration): void {
    if (this.addingDamage) {
      this.damageConfigurationCollection.damageConfigurations.push(config);
    }
    this.configuringDamage = null;
    this.addingDamage = false;
  }

  /************************************ Limited Use **********************************/

  private initializeLimitedUse(): void {
    if (this.action.limitedUse == null) {
      this.action.limitedUse = new LimitedUse();
    }
  }

  private initializeLimitedUseCategories(): void {
    this.limitedUseCategories = [];
    this.limitedUseCategories.push(LimitedUseType.QUANTITY);
    this.limitedUseCategories.push(LimitedUseType.RECHARGE);
  }

  changeLimitedUse(value: LimitedUseType): void {
    this.selectedLimitedUseCategory = value;
    if (this.action.limitedUse != null) {
      this.action.limitedUse.limitedUseType = value;
    }
    this.isQuantity = value === LimitedUseType.QUANTITY;
    this.isRecharge = value === LimitedUseType.RECHARGE;

    if (this.isRecharge && !this.loading) {
      this.action.limitedUse.quantity = 1;
      this.action.limitedUse.abilityModifier = '0';
      this.action.rechargeMin = 6;
      this.action.rechargeMax = 6;
    }
  }

  private initializeSelectedLimitedUseCategory(): void {
    this.limitedUse = this.action.limitedUse != null;
    if (this.limitedUse) {
      this.changeLimitedUse(this.action.limitedUse.limitedUseType);
    } else {
      this.changeLimitedUse(LimitedUseType.QUANTITY);
    }
  }

  limitedUseChange(event: MatCheckboxChange): void {
    this.limitedUse = event.checked;
    this.initializeLimitedUse();
  }

  rechargeMinChange(input): void {
    this.action.rechargeMin = parseInt(input.value, 10);
    if (this.action.rechargeMax < this.action.rechargeMin) {
      this.action.rechargeMax = this.action.rechargeMin;
    }
  }

  rechargeMaxChange(input): void {
    this.action.rechargeMax = parseInt(input.value, 10);
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
          this.headerName = this.action.name;
        }
        break;
      case 1:
        this.headerName = this.translate.instant('Details');
        break;
      case 2:
        this.headerName = this.translate.instant('Headers.LimitedUse');
        break;
    }
  }

  updateAction(): void {
    this.initializeSelectedLimitedUseCategory();
    this.attackTypeChange(this.action.attackType);

    this.damageConfigurationCollection = this.monsterService.initializeDamageConfigurations(this.action);
    this.originalDamageConfigurationCollection =
      this.monsterService.createCopyOfDamageConfigurationCollection(this.damageConfigurationCollection);

    this.initializeSelectedAttackAbilityModifier();
    this.initializeSelectedSaveAbilityModifier();
  }

  private saveClick(): void {
    if (this.action.name == null || this.action.name === '') {
      this.notificationService.error(this.translate.instant('Error.NameRequired'));
      return;
    }
    if (!this.limitedUse) {
      this.action.limitedUse = null;
    }
    this.monsterService.setDamageConfigurations(this.action, this.damageConfigurationCollection);
    if (this.action.id == null || this.action.id === '0') {
      this.monsterService.createPower(this.monster.id, this.action).then((id: string) => {
        this.loading = false;
        this.action.id = id;
        this.continue.emit(this.action);
      }, () => {
        const translatedMessage = this.translate.instant('Error.Save');
        this.notificationService.error(translatedMessage);
        this.loading = false;
      });
    } else {
      this.monsterService.updatePower(this.monster.id, this.action).then(() => {
        this.loading = false;
        this.continue.emit(this.action);
      }, () => {
        const translatedMessage = this.translate.instant('Error.Save');
        this.notificationService.error(translatedMessage);
        this.loading = false;
      });
    }
  }

}
