import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureWealthAmount} from '../../../../shared/models/creatures/creature-wealth-amount';
import * as _ from 'lodash';
import {CreatureWealth} from '../../../../shared/models/creatures/creature-wealth';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {YesNoDialogData} from '../../../../core/components/yes-no-dialog/yes-no-dialog-data';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {YesNoDialogComponent} from '../../../../core/components/yes-no-dialog/yes-no-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {CURRENCY_MAX_VALUE, EVENTS} from '../../../../constants';
import {ConfirmDialogData} from '../../../../core/components/confirm-dialog/confirmDialogData';
import {ConfirmDialogComponent} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import {CostUnitService} from '../../../../core/services/items/cost-unit.service';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';

export class CreatureWealthAmountAdjustment {
  creatureWealthAmount: CreatureWealthAmount;
  amount = 0;
  totalAdjustment = 0;
  conversionTooltip = '';
  flash = false;
}

@Component({
  selector: 'app-creature-wealth',
  templateUrl: './creature-wealth.component.html',
  styleUrls: ['./creature-wealth.component.scss']
})
export class CreatureWealthComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() calculateCurrencyWeight = false;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  MAX_ADJUSTMENT_AMOUNT = 99999;

  configuring = false;
  converting = false;
  adjustments: CreatureWealthAmountAdjustment[] = [];
  currencyWeight = 0;
  changesMade = false;

  constructor(
    private costUnitService: CostUnitService,
    private creatureService: CreatureService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeAdjustments();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.WealthUpdated) {
        this.initializeAdjustments();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeAdjustments(): void {
    const visibleCostUnits = this.getVisibleCostUnits();
    const adjustments: CreatureWealthAmountAdjustment[] = [];
    this.creature.creatureWealth.amounts.forEach((creatureWealthAmount: CreatureWealthAmount) => {
      const adjustment = new CreatureWealthAmountAdjustment();
      adjustment.creatureWealthAmount = _.cloneDeep(creatureWealthAmount);
      adjustment.conversionTooltip = this.costUnitService.getConversionTooltip(creatureWealthAmount.costUnit, visibleCostUnits);
      adjustments.push(adjustment);
    });
    this.adjustments = adjustments;
    this.updateCurrencyWeight();
  }

  private getVisibleCostUnits(): string[] {
    const visibleCostUnits: string[] = [];
    this.creature.creatureWealth.amounts.forEach((creatureWealthAmount: CreatureWealthAmount) => {
      if (creatureWealthAmount.display) {
        visibleCostUnits.push(creatureWealthAmount.costUnit.id);
      }
    });
    return visibleCostUnits;
  }

  private updateCurrencyWeight(): void {
    let weight = 0.0;
    this.adjustments.forEach((adjustment: CreatureWealthAmountAdjustment) => {
      if (adjustment.creatureWealthAmount.amount > 0) {
        weight += (adjustment.creatureWealthAmount.amount * adjustment.creatureWealthAmount.costUnit.weight);
      }
    });
    weight = Math.round(weight * 1000) / 1000.0;
    this.currencyWeight = weight;
  }

  cardClick(adjustment: CreatureWealthAmountAdjustment): void {
    if (adjustment.amount === 0) {
      adjustment.amount = Math.abs(adjustment.totalAdjustment);
      if (adjustment.amount > this.MAX_ADJUSTMENT_AMOUNT) {
        adjustment.amount = this.MAX_ADJUSTMENT_AMOUNT;
      }
    }
  }

  convertClick(): void {
    const callback = () => {
      this.converting = true;
    };
    this.verifyBeforeContinue(callback);
  }

  gainClick(): void {
    this.applyAdjustments(1);
  }

  loseClick(): void {
    this.applyAdjustments(-1);
  }

  private applyAdjustments(modifier: number): void {
    this.adjustments.forEach((adjustment: CreatureWealthAmountAdjustment) => {
      if (adjustment.amount !== 0) {
        this.changesMade = true;
      }
      adjustment.creatureWealthAmount.amount += (adjustment.amount * modifier);
      if (adjustment.creatureWealthAmount.amount > CURRENCY_MAX_VALUE) {
        adjustment.creatureWealthAmount.amount = CURRENCY_MAX_VALUE;
      } else if (adjustment.creatureWealthAmount.amount < CURRENCY_MAX_VALUE * -1) {
        adjustment.creatureWealthAmount.amount = CURRENCY_MAX_VALUE * -1;
      }
      adjustment.totalAdjustment += (adjustment.amount * modifier);
      adjustment.amount = 0;
    });
    this.autoConvertCurrency();
    this.updateCurrencyWeight();
  }

  private autoConvertCurrency(): void {
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      if (playerCharacter.characterSettings.equipment.autoConvertCurrency) {
        //todo
      }
    }
  }

  closeDetails(): void {
    this.close.emit();
  }

  saveDetails(): void {
    if (this.hasUnsavedChanges()) {
      this.showUnsavedChanges();
    } else if (!this.changesMade) {
      this.close.emit();
    } else if (this.hasNegativeValues()) {
      this.showNegativeWarning();
    } else {
      this.continueSave(true);
    }
  }

  private hasUnsavedChanges(): boolean {
    for (let i = 0; i < this.adjustments.length; i++) {
      if (this.adjustments[i].amount !== 0) {
        return true;
      }
    }
    return false;
  }

  private hasNegativeValues(): boolean {
    for (let i = 0; i < this.adjustments.length; i++) {
      if (this.adjustments[i].creatureWealthAmount.amount < 0) {
        return true;
      }
    }
    return false;
  }

  private showUnsavedChanges(): void {
    const data = new YesNoDialogData();
    data.title = this.translate.instant('Warning');
    data.message = this.translate.instant('CharacterWealth.Warning.Message');
    data.yes = () => {
      this.continueSave(true);
    };
    data.no = () => {
      //do nothing
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(YesNoDialogComponent, dialogConfig);
  }

  private showNegativeWarning(): void {
    const data = new YesNoDialogData();
    data.title = this.translate.instant('Warning');
    data.message = this.translate.instant('CharacterWealth.Negative.Message');
    data.yes = () => {
      this.continueSave(true);
    };
    data.no = () => {
      //do nothing
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(YesNoDialogComponent, dialogConfig);
  }

  private continueSave(close: boolean): Promise<any> {
    const updatedWealth = new CreatureWealth();
    updatedWealth.amounts = this.getUpdatedAmounts();
    return this.creatureService.updateCreatureWealth(this.creature, updatedWealth).then(() => {
      this.creature.creatureWealth = updatedWealth;
      this.changesMade = false;
      this.eventsService.dispatchEvent(EVENTS.WealthUpdated);

      if (close) {
        this.save.emit();
      }
    });
  }

  private getUpdatedAmounts(): CreatureWealthAmount[] {
    const amounts: CreatureWealthAmount[] = [];
    this.adjustments.forEach((adjustment: CreatureWealthAmountAdjustment) => {
      amounts.push(adjustment.creatureWealthAmount);
    });
    return amounts;
  }

  configure(): void {
    const callback = () => {
      this.configuring = true;
    };
    this.verifyBeforeContinue(callback);
  }

  private verifyBeforeContinue(callback: () => void): void {
    if (this.hasUnsavedChanges()) {
      const data = new ConfirmDialogData();
      data.title = this.translate.instant('UnsavedChanges')
      data.message = this.translate.instant('CharacterWealth.Configure.ContinueWithoutSaving');
      data.confirm = () => {
        this.continueSave(false).then(() => {
          callback();
        });
      };
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;
      this.dialog.open(ConfirmDialogComponent, dialogConfig);
    } else if (this.changesMade) {
      this.continueSave(false).then(() => {
        callback();
      });
    } else {
      callback();
    }
  }

  closeConfigurations(): void {
    this.configuring = false;
  }

  saveConfigurations(): void {
    this.configuring = false;
    this.eventsService.dispatchEvent(EVENTS.WealthUpdated);
  }

  closeConvert(): void {
    this.converting = false;
  }

  saveConvert(): void {
    this.converting = false;
    this.eventsService.dispatchEvent(EVENTS.WealthUpdated);
  }

}
