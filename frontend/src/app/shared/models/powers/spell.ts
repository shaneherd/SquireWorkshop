import {SpellSchool} from '../attributes/spell-school';
import {CastingTimeUnit} from '../casting-time-unit.enum';
import {Power} from './power';
import {PowerType} from './power-type.enum';

export class Spell extends Power {
  type = 'Spell';
  level = 0;
  spellSchool: SpellSchool = new SpellSchool();
  ritual = false;
  castingTime = 1;
  castingTimeUnit = CastingTimeUnit.ACTION;
  verbal = false;
  somatic = false;
  material = false;
  components = '';
  instantaneous = true;
  concentration = false;
  duration = '';
  description = '';
  higherLevels = '';
  powerType = PowerType.SPELL;

  constructor() {
    super();
    this.powerType = PowerType.SPELL;
  }
}
