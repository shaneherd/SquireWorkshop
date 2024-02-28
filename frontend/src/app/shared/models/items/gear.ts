import {Item} from './item';
import {ItemType} from './item-type.enum';
import {ItemTypeValue} from '../../../constants';

export class Gear extends Item {
  type: ItemTypeValue = 'Gear';
  itemType: ItemType = ItemType.GEAR;
}
