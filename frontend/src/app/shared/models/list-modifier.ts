import {ListObject} from './list-object';

export class ListModifier {
  item: ListObject;
  value = 0;
  parentValue = 0;

  constructor(item: ListObject) {
    this.item = item;
  }
}
