import {SpellListObject} from './powers/spell-list-object';

export class CalculatedSpellPreparation {
  spell: SpellListObject;
  alwaysPrepared = false;
  countTowardsPrepared = true;
  requiresPreparation = false;
}
