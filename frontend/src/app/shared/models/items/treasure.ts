import {Item} from './item';
import {ItemType} from './item-type.enum';
import {ItemTypeValue} from '../../../constants';

export class Treasure extends Item {
  type: ItemTypeValue = 'Treasure';
  itemType: ItemType = ItemType.TREASURE;
}
