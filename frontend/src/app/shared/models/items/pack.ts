import {Item} from './item';
import {ItemQuantity} from './item-quantity';
import {ItemType} from './item-type.enum';
import {ItemTypeValue} from '../../../constants';

export class Pack extends Item {
  type: ItemTypeValue = 'Pack';
  itemType: ItemType = ItemType.PACK;
  items: ItemQuantity[] = [];
}
