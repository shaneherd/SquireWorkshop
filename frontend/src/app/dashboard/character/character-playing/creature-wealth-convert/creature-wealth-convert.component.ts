import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CostUnit, CostUnitConversion, CostUnitConversionResult} from '../../../../shared/models/items/cost-unit';
import {CostUnitService} from '../../../../core/services/items/cost-unit.service';
import {CreatureWealth} from '../../../../shared/models/creatures/creature-wealth';
import * as _ from 'lodash';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureWealthAmount} from '../../../../shared/models/creatures/creature-wealth-amount';
import {CreatureWealthAmountAdjustment} from '../creature-wealth/creature-wealth.component';
import {ConfirmDialogData} from '../../../../core/components/confirm-dialog/confirmDialogData';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {YesNoDialogData} from '../../../../core/components/yes-no-dialog/yes-no-dialog-data';
import {YesNoDialogComponent} from '../../../../core/components/yes-no-dialog/yes-no-dialog.component';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-creature-wealth-convert',
  templateUrl: './creature-wealth-convert.component.html',
  styleUrls: ['./creature-wealth-convert.component.scss']
})
export class CreatureWealthConvertComponent implements OnInit {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  adjustments: CreatureWealthAmountAdjustment[] = [];
  fromUnit: CostUnit;
  toUnit: CostUnit;
  amount = 0;

  visibleUnits: string[] = [];
  costUnits: CostUnit[] = [];
  toUnits: CostUnit[] = [];

  originalFromWealth: CreatureWealthAmountAdjustment;
  fromWealth: CreatureWealthAmountAdjustment;
  originalToWealth: CreatureWealthAmountAdjustment;
  toWealth: CreatureWealthAmountAdjustment;
  conversion: CostUnitConversion;
  max = 0;
  changesMade = false;

  constructor(
    private dialog: MatDialog,
    private creatureService: CreatureService,
    private costUnitService: CostUnitService,
    private translate: TranslateService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeCostUnits();
    this.initializeAdjustments();
    this.initializeFromUnit();
  }

  private initializeAdjustments(): void {
    const adjustments: CreatureWealthAmountAdjustment[] = [];
    this.creature.creatureWealth.amounts.forEach((creatureWealthAmount: CreatureWealthAmount) => {
      const adjustment = new CreatureWealthAmountAdjustment();
      adjustment.creatureWealthAmount = _.cloneDeep(creatureWealthAmount);
      adjustments.push(adjustment);
    });
    this.adjustments = adjustments;
  }

  private initializeCostUnits(): void {
    this.costUnits = [];
    this.visibleUnits = [];
    this.creature.creatureWealth.amounts.forEach((creatureWealthAmount: CreatureWealthAmount) => {
      if (creatureWealthAmount.display) {
        this.costUnits.push(creatureWealthAmount.costUnit);
        this.visibleUnits.push(creatureWealthAmount.costUnit.id);
      }
    });
  }

  private initializeFromUnit(): void {
    if (this.costUnits.length > 0) {
      this.fromCostUnitChange(this.costUnits[0]);
    }
  }

  private initializeToUnit(): void {
    this.toUnits = this.costUnitService.getApplicableConversionUnits(this.fromUnit, this.visibleUnits);
    if (this.toUnits.length > 0) {
      this.toCostUnitChange(this.toUnits[0]);
    }
  }

  fromCostUnitChange(costUnit: CostUnit): void {
    if (costUnit !== this.fromUnit) {
      this.fromUnit = costUnit;
      const adjustment = this.getAdjustment(costUnit);
      if (adjustment != null) {
        this.fromWealth = _.cloneDeep(adjustment);
        this.originalFromWealth = adjustment;
        this.max = this.fromWealth.creatureWealthAmount.amount;
      }

      this.initializeToUnit();
      this.amount = 0;
      this.amountChange();
    }
  }

  toCostUnitChange(costUnit: CostUnit): void {
    this.toUnit = costUnit;
    const adjustment = this.getAdjustment(costUnit);
    if (adjustment != null) {
      this.toWealth = _.cloneDeep(adjustment);
      this.originalToWealth = adjustment;
    }
    this.conversion = this.costUnitService.getCostUnitConversion(this.fromUnit, this.toUnit);
    this.amountChange();
  }

  private getAdjustment(costUnit: CostUnit): CreatureWealthAmountAdjustment {
    for (let i = 0; i < this.adjustments.length; i++) {
      const adjustment = this.adjustments[i];
      if (adjustment.creatureWealthAmount.costUnit.id === costUnit.id) {
        return adjustment;
      }
    }
    return null;
  }

  closeDetails(): void {
    this.close.emit();
  }

  saveDetails(): void {
    if (this.amount !== 0) {
      this.showWarningMessage();
    } else {
      this.continueSave();
    }
  }

  private showWarningMessage(): void {
    const data = new YesNoDialogData();
    data.title = this.translate.instant('Warning');
    data.message = this.translate.instant('CharacterWealth.Warning.Message');
    data.yes = () => {
      this.continueSave();
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

  private continueSave(): void {
    if (this.changesMade) {
      const updatedWealth = new CreatureWealth();
      updatedWealth.amounts = this.getUpdatedAmounts();
      this.creatureService.updateCreatureWealth(this.creature, updatedWealth).then(() => {
        this.creature.creatureWealth = updatedWealth;
        this.save.emit();
        this.eventsService.dispatchEvent(EVENTS.CarryingUpdated);
      });
    } else {
      this.close.emit();
    }
  }

  private getUpdatedAmounts(): CreatureWealthAmount[] {
    const amounts: CreatureWealthAmount[] = [];
    this.adjustments.forEach((adjustment: CreatureWealthAmountAdjustment) => {
      amounts.push(adjustment.creatureWealthAmount);
    });
    return amounts;
  }

  amountChange(): void {
    const conversionAmount: CostUnitConversionResult = this.costUnitService.getConversionAmount(this.conversion, this.amount);
    this.fromWealth = _.cloneDeep(this.originalFromWealth);
    this.toWealth = _.cloneDeep(this.originalToWealth);

    this.fromWealth.creatureWealthAmount.amount -= conversionAmount.amountUsed;
    this.fromWealth.totalAdjustment -= conversionAmount.amountUsed;
    this.toWealth.creatureWealthAmount.amount += conversionAmount.amountGained;
    this.toWealth.totalAdjustment += conversionAmount.amountGained;
  }

  applyConversion(): void {
    this.costUnitService.applyConversion(this.fromUnit, this.toUnit, this.amount, this.adjustments);

    const fromUnit = this.fromUnit;
    const toUnit = this.toUnit;
    this.fromUnit = null;
    this.toUnit = null;
    this.fromCostUnitChange(fromUnit);
    this.toCostUnitChange(toUnit);
    this.changesMade = true;
  }
}
