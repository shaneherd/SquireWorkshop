import {Item} from './item';
import {ItemTypeValue} from '../../../constants';
import {ItemType} from './item-type.enum';

export class Vehicle extends Item {
  type: ItemTypeValue = 'Vehicle';
  itemType: ItemType = ItemType.VEHICLE;
}
