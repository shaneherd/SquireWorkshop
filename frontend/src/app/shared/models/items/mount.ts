import {Item} from './item';
import {ItemType} from './item-type.enum';
import {ItemTypeValue} from '../../../constants';

export class Mount extends Item {
  type: ItemTypeValue = 'Mount';
  itemType: ItemType = ItemType.MOUNT;
  speed = 0;
  carryingCapacity = 0;
}
