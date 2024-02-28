import {CreatureListModifierValue} from './creature-list-modifier-value';
import {ListObject} from '../list-object';

export class CreatureListModifier {
  item: ListObject;
  value = 0;
  inheritedValues: CreatureListModifierValue[] = [];

  constructor(item: ListObject) {
    this.item = item;
  }
}
