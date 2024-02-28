import {ItemListObject} from './item-list-object';

export class ItemListResponse {
  items: ItemListObject[] = [];
  hasMore = false;
}
