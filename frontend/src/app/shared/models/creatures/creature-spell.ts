import {SpellListObject} from '../powers/spell-list-object';
import {CreaturePower} from './creature-power';
import {CastingTimeUnit} from '../casting-time-unit.enum';

export class CreatureSpell extends CreaturePower {
  spell: SpellListObject;
  prepared = false;
  concentrating = false;
  activeLevel = 0;
  castingTimeUnit: CastingTimeUnit;

  innate = false;
  innateSlot = 0;
  innateMaxUses = 0;
}
