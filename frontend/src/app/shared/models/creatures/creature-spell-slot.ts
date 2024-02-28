export class CreatureSpellSlot {
  level = 0;
  remaining = 0;
  calculatedMax = 0;
  maxModifier = 0;

  constructor(level = 0, remaining = 0, calculatedMax = 0, maxModifier = 0)  {
    this.level = level;
    this.remaining = remaining;
    this.calculatedMax = calculatedMax;
    this.maxModifier = maxModifier;
  }
}
