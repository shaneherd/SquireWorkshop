import {Injectable} from '@angular/core';
import {CostUnit, CostUnitConversion, CostUnitConversionResult} from '../../../shared/models/items/cost-unit';
import {LOCAL_STORAGE} from '../../../constants';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {CreatureWealthAmountAdjustment} from '../../../dashboard/character/character-playing/creature-wealth/creature-wealth.component';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CostUnitService {
  private conversionMap: Map<string, CostUnitConversion[]> = null;

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) { }

  initializeCostUnitsDetailed(): Promise<CostUnit[]> {
    return this.http.get<CostUnit[]>(`${environment.backendUrl}/items/costUnits/detailed`)
      .toPromise().then((costUnits: CostUnit[]) => {
        localStorage.setItem(LOCAL_STORAGE.COST_UNITS, JSON.stringify(costUnits));
        this.initializeConversionMap();
        return costUnits;
      });
  }

  getCostUnitsDetailedFromStorage(): CostUnit[] {
    let costUnits: CostUnit[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE.COST_UNITS));
    if (costUnits == null) {
      costUnits = [];
    }
    return costUnits;
  }

  getCostUnitByAbbreviation(abbr: string): CostUnit {
    const costUnits = this.getCostUnitsDetailedFromStorage();
    for (let i = 0; i < costUnits.length; i++) {
      const costUnit = costUnits[i];
      if (costUnit.abbreviation === abbr) {
        return costUnit;
      }
    }
    return null;
  }

  private initializeConversionMap(): void {
    const costUnits = this.getCostUnitsDetailedFromStorage();

    const conversionMap = new Map<string, CostUnitConversion[]>();
    costUnits.forEach((costUnit: CostUnit) => {
      const conversions: CostUnitConversion[] = this.getConversionList(costUnit);
      conversionMap.set(costUnit.id, conversions);
    });
    this.conversionMap = conversionMap;
  }

  private getConversionList(costUnit: CostUnit): CostUnitConversion[] {
    let baseUnit = this.getConversionCostUnit(costUnit);
    if (baseUnit == null) {
      baseUnit = costUnit;
    }

    const conversions: CostUnitConversion[] = this.getParentConversions(costUnit, baseUnit, 1);
    if (baseUnit.id !== costUnit.id) {
      const baseCostUnitConversion = new CostUnitConversion();
      baseCostUnitConversion.fromUnit = costUnit;
      baseCostUnitConversion.fromAmount = 1;
      baseCostUnitConversion.toUnit  = baseUnit;
      baseCostUnitConversion.toAmount = costUnit.conversionAmount;
      conversions.push(baseCostUnitConversion);
    }
    this.reduceValues(conversions);
    this.sortConversionList(conversions);
    return conversions;
  }

  private sortConversionList(conversions: CostUnitConversion[]): void {
    conversions.sort((left: CostUnitConversion, right: CostUnitConversion) => {
      const diff = right.fromAmount - left.fromAmount;
      if (diff === 0) {
        return left.toAmount - right.toAmount;
      }
      return diff;
    });
  }

  private reduceValues(conversions: CostUnitConversion[]): void {
    conversions.forEach((conversion: CostUnitConversion) => {
      if (conversion.fromAmount !== 0 && conversion.toAmount !== 0) {
        const gcd = this.greatestCommonDivisor(conversion.fromAmount, conversion.toAmount);
        conversion.fromAmount /= gcd;
        conversion.toAmount /= gcd;
      }
    });
  }

  private greatestCommonDivisor(a: number, b: number): number {
    if (b === 0) {
      return a;
    }
    return this.greatestCommonDivisor(b, a % b);
  }

  private getParentConversions(fromUnit: CostUnit, costUnit: CostUnit, amount: number): CostUnitConversion[] {
    const conversions: CostUnitConversion[] = [];

    const parentConversionUnits: CostUnit[] = this.getParentConversionCostUnit(costUnit);

    parentConversionUnits.forEach((parent: CostUnit) => {
      const adjustment = amount * parent.conversionAmount;

      if (parent.id !== fromUnit.id) {
        const costUnitConversion = new CostUnitConversion();
        costUnitConversion.fromUnit = fromUnit;
        costUnitConversion.fromAmount = adjustment;
        costUnitConversion.toUnit  = parent;
        costUnitConversion.toAmount = fromUnit.conversionAmount;
        conversions.push(costUnitConversion);
      }
    });

    return conversions;
  }

  private getConversionMapFromStorage(): Map<string, CostUnitConversion[]> {
    if (this.conversionMap == null) {
      this.initializeConversionMap();
    }
    return this.conversionMap;
  }

  getApplicableConversionUnits(costUnit: CostUnit, visibleCostUnits: string[]): CostUnit[] {
    const conversionMap: Map<string, CostUnitConversion[]> = this.getConversionMapFromStorage();
    const conversions = conversionMap.get(costUnit.id);
    if (conversions == null || conversions.length === 0) {
      return [];
    }

    const costUnits: CostUnit[] = [];
    conversions.forEach((conversion: CostUnitConversion) => {
      if (this.isCostUnitVisible(conversion.toUnit, visibleCostUnits)) {
        costUnits.push(conversion.toUnit);
      }
    });
    return costUnits;
  }

  getConversionTooltip(costUnit: CostUnit, visibleCostUnits: string[]): string {
    const conversionMap: Map<string, CostUnitConversion[]> = this.getConversionMapFromStorage();
    const conversions = conversionMap.get(costUnit.id);
    if (conversions == null || conversions.length === 0) {
      return '';
    }

    const parts: string[] = [];
    conversions.forEach((conversion: CostUnitConversion) => {
      if (this.isCostUnitVisible(conversion.toUnit, visibleCostUnits)) {
        parts.push(this.translate.instant('CharacterWealth.ConversionTooltip', {
          fromAmount: conversion.fromAmount,
          fromUnit: conversion.fromUnit.name,
          toAmount: conversion.toAmount,
          toUnit: conversion.toUnit.name
        }));
      }
    });
    return parts.join('\n');
  }

  private isCostUnitVisible(costUnit: CostUnit, visibleCostUnits: string[]): boolean {
    for (let i = 0; i < visibleCostUnits.length; i++) {
      if (visibleCostUnits[i] === costUnit.id) {
        return true;
      }
    }
    return false;
  }

  private getConversionCostUnit(costUnit: CostUnit): CostUnit {
    if (costUnit.conversionUnitId === '0') {
      return null;
    }
    const costUnits = this.getCostUnitsDetailedFromStorage();
    for (let i = 0; i < costUnits.length; i++) {
      const conversionUnit = costUnits[i];
      if (conversionUnit.id === costUnit.conversionUnitId) {
        return conversionUnit;
      }
    }
    return null;
  }

  private getParentConversionCostUnit(costUnit: CostUnit, ignoredParentId = '0'): CostUnit[] {
    const parents: CostUnit[] = [];
    const costUnits = this.getCostUnitsDetailedFromStorage();
    costUnits.forEach((unit: CostUnit) => {
      if (unit.conversionUnitId === costUnit.id && unit.id !== ignoredParentId) {
        parents.push(unit);
      }
    });
    return parents;
  }

  getConversionAmount(costUnitConversion: CostUnitConversion, amount: number): CostUnitConversionResult {
    if (costUnitConversion == null) {
      return new CostUnitConversionResult(null, 0, 0);
    }

    const conversions = Math.floor(amount / costUnitConversion.fromAmount);
    const remaining = amount % costUnitConversion.fromAmount;
    const amountUsed = amount - remaining;
    const amountGained = conversions * costUnitConversion.toAmount;
    return new CostUnitConversionResult(costUnitConversion, amountUsed, amountGained);
  }

  getCostUnitConversion(fromUnit: CostUnit, toUnit: CostUnit): CostUnitConversion {
    const conversionMap: Map<string, CostUnitConversion[]> = this.getConversionMapFromStorage();
    const conversions = conversionMap.get(fromUnit.id);
    let conversion: CostUnitConversion = null;
    if (conversions != null && conversions.length > 0) {
      for (let i = 0; i < conversions.length; i++) {
        const current = conversions[i];
        if (current.toUnit.id === toUnit.id) {
          conversion = current;
          break;
        }
      }
    }
    return conversion;
  }

  applyConversion(fromUnit: CostUnit, toUnit: CostUnit, amount: number, adjustments: CreatureWealthAmountAdjustment[]): void {
    if (amount === 0) {
      return;
    }

    const conversion = this.getCostUnitConversion(fromUnit, toUnit);
    const conversionAmount: CostUnitConversionResult = this.getConversionAmount(conversion, amount);
    if (conversionAmount.amountUsed !== 0) {
      this.applyAdjustment(fromUnit, conversionAmount.amountUsed * -1, adjustments);
    }
    if (conversionAmount.amountGained !== 0) {
      this.applyAdjustment(toUnit, conversionAmount.amountGained, adjustments);
    }
  }

  private applyAdjustment(costUnit: CostUnit, amount: number, adjustments: CreatureWealthAmountAdjustment[]): void {
    const adjustment: CreatureWealthAmountAdjustment = this.getAdjustment(costUnit, adjustments);
    if (adjustment != null) {
      adjustment.creatureWealthAmount.amount += amount;
    }
  }

  private getAdjustment(costUnit: CostUnit, adjustments: CreatureWealthAmountAdjustment[]): CreatureWealthAmountAdjustment {
    for (let i = 0; i < adjustments.length; i++) {
      const adjustment = adjustments[i];
      if (adjustment.creatureWealthAmount.costUnit.id === costUnit.id) {
        return adjustment;
      }
    }
    return null;
  }
}
