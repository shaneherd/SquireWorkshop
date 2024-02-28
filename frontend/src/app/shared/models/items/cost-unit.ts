export class CostUnit {
  id = '0';
  name = '';
  abbreviation = '';
  conversionUnitId = '0';
  conversionAmount = 0;
  weight = 0.0;
}

export class CostUnitConversion {
  fromUnit: CostUnit;
  fromAmount = 0;
  toUnit: CostUnit;
  toAmount = 0;
}

export class CostUnitConversionResult {
  costUnitConversion: CostUnitConversion;
  amountUsed = 0;
  amountGained = 0;

  constructor(costUnitConversion: CostUnitConversion, amountUsed: number, amountGained: number) {
    this.costUnitConversion = costUnitConversion;
    this.amountUsed = amountUsed;
    this.amountGained = amountGained;
  }
}
