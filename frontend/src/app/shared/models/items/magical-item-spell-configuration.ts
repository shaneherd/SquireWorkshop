import {SimpleSpellListItem} from '../powers/simple-spell-list-item';
import {CharacterLevel} from '../character-level';

export class MagicalItemSpellConfiguration extends SimpleSpellListItem {
  additional = false;
  storedLevel = 0;
  casterLevel: CharacterLevel = null;
  allowCastingAtHigherLevel = false;
  charges = 0;
  chargesPerLevelAboveStoredLevel = 0;
  maxLevel = 9;
  removeOnCasting = false;
  overrideSpellAttackCalculation = false;
  spellAttackModifier = 0;
  spellSaveDC = 0;

  active = false;
  activeLevel = 0;
  concentrating = false;
}
