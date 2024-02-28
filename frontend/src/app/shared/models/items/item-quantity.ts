import {ItemListObject} from './item-list-object';

export class ItemQuantity {
  item: ItemListObject;
  quantity = 0;
  author = true;
}

export class ItemQuantityList {
  items: ItemQuantity[] = [];
}
