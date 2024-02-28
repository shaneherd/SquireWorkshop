import {ListObject} from './list-object';
import {LimitedUse} from './powers/limited-use';

export class SpellConfigurationCollectionItem {
  spell: ListObject;
  levelGained: ListObject;
  alwaysPrepared = false;
  countTowardsPrepared = true;
  notes = '';
  author = false;

  parent: SpellConfigurationCollectionItem;
}

export class InnateSpellConfigurationCollectionItem {
  spell: ListObject;
  limitedUse: LimitedUse = new LimitedUse();
  slot = 0;
  author = false;

  parent: SpellConfigurationCollectionItem;
}
