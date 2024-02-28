import {ListObject} from './list-object';

export class ListProficiency {
  item: ListObject;
  proficient = false;
  secondaryProficient = false;
  inheritedProficient = false;
  inheritedSecondaryProficient = false;
  parentProficiency: ListProficiency;
  childrenProficiencies: ListProficiency[] = [];
  categoryId: string;

  constructor(item: ListObject) {
    this.item = item;
  }
}
