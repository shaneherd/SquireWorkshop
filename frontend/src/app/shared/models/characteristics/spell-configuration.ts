import {ListObject} from '../list-object';

export class SpellConfiguration {
  spell: ListObject;
  levelGained: ListObject;
  alwaysPrepared = false;
  countTowardsPrepared = true;
  notes = '';
  author = false;
}
