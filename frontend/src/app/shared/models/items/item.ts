import {ItemType} from './item-type.enum';
import {EquipmentSlotType} from './equipment-slot-type.enum';
import {CostUnit} from './cost-unit';
import {ItemTypeValue} from '../../../constants';

export class Item {
  type: ItemTypeValue = 'Item';
  id = '0';
  name: string;
  itemType: ItemType;
  expendable = false;
  equippable = false;
  slot: EquipmentSlotType;
  container = false;
  ignoreWeight = false;
  cost = 0;
  costUnit: CostUnit = new CostUnit();
  weight = 0;
  description = '';
  sid = 0;
  author = false;
  version = 0;
  categoryId = '';
}
