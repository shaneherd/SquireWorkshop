import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureWealthAmountAdjustment} from '../../../character/character-playing/creature-wealth/creature-wealth.component';
import {CreatureWealthAmount} from '../../../../shared/models/creatures/creature-wealth-amount';
import * as _ from 'lodash';
import {CostUnitService} from '../../../../core/services/items/cost-unit.service';
import {CURRENCY_MAX_VALUE, EVENTS, INPUT_FLASH_DURATION} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {CostUnit} from '../../../../shared/models/items/cost-unit';
import {ItemQuantity} from '../../../../shared/models/items/item-quantity';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureWealth} from '../../../../shared/models/creatures/creature-wealth';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {YesNoDialogData} from '../../../../core/components/yes-no-dialog/yes-no-dialog-data';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {YesNoDialogComponent} from '../../../../core/components/yes-no-dialog/yes-no-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {ItemType} from '../../../../shared/models/items/item-type.enum';

export class CostValue {
  costUnit: CostUnit;
  value = 0;
}

@Component({
  selector: 'app-cost-details',
  templateUrl: './cost-details.component.html',
  styleUrls: ['./cost-details.component.scss']
})
export class CostDetailsComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() items: ItemQuantity[] = [];
  @Input() id: string;
  @Input() modifier = 1;
  @Output() continue = new EventEmitter<null>();

  adjustments: CreatureWealthAmountAdjustment[] = [];
  costValues: CostValue[] = [];
  singleValue: CostValue = null;
  valuesCount = 0;
  changesMade = false;
  eventSub: Subscription;

  constructor(
    private eventsService: EventsService,
    private costUnitService: CostUnitService,
    private creatureService: CreatureService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.initializeAdjustments();
    this.initializeCostValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.CartItemsChanged) {
        this.updateCostValues();
      } else if (event === EVENTS.SaveWealthAdjustments + this.id) {
        this.save();
      } else if (event === EVENTS.WealthUpdated) {
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

  cardClick(adjustment: CreatureWealthAmountAdjustment): void {
    if (adjustment.amount === 0) {
      this.matchValue(adjustment);
    }
  }

  private matchValue(adjustment: CreatureWealthAmountAdjustment): void {
    const costValue = this.getCostValue(adjustment.creatureWealthAmount.costUnit.id);
    if (costValue != null) {
      if (adjustment.amount !== costValue.value) {
        adjustment.amount = costValue.value;
        this.flashInput(adjustment);
      }
    }
  }

  private flashInput(adjustment: CreatureWealthAmountAdjustment): void {
    adjustment.flash = true;
    setTimeout(() => {
      adjustment.flash = false;
    }, INPUT_FLASH_DURATION);
  }

  match(): void {
    this.adjustments.forEach((adjustment: CreatureWealthAmountAdjustment) => {
      this.matchValue(adjustment);
    });
  }

  private initializeCostValues(): void {
    const values: CostValue[] = [];
    const costUnits = this.costUnitService.getCostUnitsDetailedFromStorage();
    costUnits.forEach((costUnit: CostUnit) => {
      const value = new CostValue();
      value.costUnit = costUnit;
      values.push(value);
    });
    this.costValues = values;
    this.updateCostValues();
  }

  private getCostValue(costUnitId: string): CostValue {
    for (let i = 0; i < this.costValues.length; i++) {
      const value = this.costValues[i];
      if (value.costUnit.id === costUnitId) {
        return value;
      }
    }
    return null;
  }

  private clearCostValues(): void {
    this.costValues.forEach((costValue: CostValue) => {
      costValue.value = 0;
    });
  }

  private updateCostValues(): void {
    this.clearCostValues();
    this.items.forEach((itemQuantity: ItemQuantity) => {
      if (itemQuantity.item.itemType === ItemType.PACK) {
        this.updatePackCostValues(itemQuantity);
      } else {
        const costValue = this.getCostValue(itemQuantity.item.costUnitId);
        if (costValue != null) {
          const cost = itemQuantity.item.cost * itemQuantity.quantity;
          costValue.value += cost;
        }
      }
    });
    this.updateSingleValue();
  }

  private updatePackCostValues(packItem: ItemQuantity): void {
    packItem.item.subItems.forEach((subItem: ItemQuantity) => {
      const costValue = this.getCostValue(subItem.item.costUnitId);
      if (costValue != null) {
        const cost = subItem.item.cost * subItem.quantity * packItem.quantity;
        costValue.value += cost;
      }
    });
  }

  private updateSingleValue(): void {
    let value: CostValue = null;
    this.valuesCount = 0;
    for (let i = 0; i < this.costValues.length; i++) {
      const costValue = this.costValues[i];
      if (costValue.value > 0) {
        this.valuesCount++;
        if (value == null) {
          value = costValue;
        }
      }
    }
    this.singleValue = value;
  }

  private save(): void {
    const adjustments = this.applyAdjustments();
    if (!this.changesMade) {
      this.showForFreeMessage(adjustments);
    } else if (this.hasNegativeValues(adjustments)) {
      this.showNegativeWarning(adjustments);
    } else {
      this.continueSave(adjustments);
    }
  }

  private hasNegativeValues(adjustments: CreatureWealthAmountAdjustment[]): boolean {
    for (let i = 0; i < adjustments.length; i++) {
      if (adjustments[i].creatureWealthAmount.amount < 0) {
        return true;
      }
    }
    return false;
  }

  private showForFreeMessage(adjustments: CreatureWealthAmountAdjustment[]): void {
    const data = new YesNoDialogData();
    if (this.modifier > 0) {
      data.title = this.translate.instant('CostDetails.GiveAwayForFree.Title');
      data.message = this.translate.instant('CostDetails.GiveAwayForFree.Message');
    } else {
      data.title = this.translate.instant('CostDetails.PurchaseForFree.Title');
      data.message = this.translate.instant('CostDetails.PurchaseForFree.Message');
    }
    data.yes = () => {
      this.continueSave(adjustments);
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

  private showNegativeWarning(adjustments: CreatureWealthAmountAdjustment[]): void {
    const data = new YesNoDialogData();
    data.title = this.translate.instant('CostDetails.Debt.Title');
    data.message = this.translate.instant('CostDetails.Debt.Message');
    data.yes = () => {
      this.continueSave(adjustments);
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

  private continueSave(adjustments: CreatureWealthAmountAdjustment[]): void {
    if (!this.changesMade) {
      this.continue.emit();
      return;
    }
    const updatedWealth = new CreatureWealth();
    updatedWealth.amounts = this.getUpdatedAmounts(adjustments);
    this.creatureService.updateCreatureWealth(this.creature, updatedWealth).then(() => {
      this.creature.creatureWealth = updatedWealth;
      this.continue.emit();
    });
  }

  private getUpdatedAmounts(adjustments: CreatureWealthAmountAdjustment[]): CreatureWealthAmount[] {
    const amounts: CreatureWealthAmount[] = [];
    adjustments.forEach((adjustment: CreatureWealthAmountAdjustment) => {
      amounts.push(adjustment.creatureWealthAmount);
    });
    return amounts;
  }

  private applyAdjustments(): CreatureWealthAmountAdjustment[] {
    this.changesMade = false;
    const adjustments = _.cloneDeep(this.adjustments);
    adjustments.forEach((adjustment: CreatureWealthAmountAdjustment) => {
      if (adjustment.amount !== 0) {
        this.changesMade = true;
      }
      adjustment.creatureWealthAmount.amount += (adjustment.amount * this.modifier);
      if (adjustment.creatureWealthAmount.amount > CURRENCY_MAX_VALUE) {
        adjustment.creatureWealthAmount.amount = CURRENCY_MAX_VALUE;
      } else if (adjustment.creatureWealthAmount.amount < CURRENCY_MAX_VALUE * -1) {
        adjustment.creatureWealthAmount.amount = CURRENCY_MAX_VALUE * -1;
      }
      adjustment.totalAdjustment += (adjustment.amount * this.modifier);
      adjustment.amount = 0;
    });
    return adjustments;
  }
}
