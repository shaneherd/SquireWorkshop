import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../../models/items/item';
import {CostUnit} from '../../models/items/cost-unit';
import {CostUnitService} from '../../../core/services/items/cost-unit.service';

@Component({
  selector: 'app-cost-configuration',
  templateUrl: './cost-configuration.component.html',
  styleUrls: ['./cost-configuration.component.scss']
})
export class CostConfigurationComponent implements OnInit {
  @Input() item: Item;
  @Input() editing = false;

  costUnits: CostUnit[] = [];

  constructor(
    private costUnitService: CostUnitService
  ) { }

  ngOnInit() {
    this.initializeCostUnits();
  }

  initializeCostUnits(): void {
    this.costUnits = this.costUnitService.getCostUnitsDetailedFromStorage();
    this.initializeSelectedCostUnit();
  }

  initializeSelectedCostUnit(): void {
    if (this.item.costUnit != null) {
      this.item.costUnit = this.getCostUnit(this.item.costUnit.id);
    }
    if ((this.item.costUnit == null || this.item.costUnit.id === '0') && this.costUnits.length > 0) {
      this.item.costUnit = this.costUnits[0];
    }
  }

  private getCostUnit(costUnitId: string): CostUnit {
    for (let i = 0; i < this.costUnits.length; i++) {
      const costUnit = this.costUnits[i];
      if (costUnit.id === costUnitId) {
        return costUnit;
      }
    }
    return null;
  }

  costChange(input): void {
    this.item.cost = input.value;
  }

  costUnitChange(value: CostUnit): void {
    this.item.costUnit = value;
  }
}
