import {Item} from './item';
import {ItemType} from './item-type.enum';
import {ToolCategory} from '../attributes/tool-category';
import {ItemTypeValue} from '../../../constants';

export class Tool extends Item {
  type: ItemTypeValue = 'Tool';
  itemType: ItemType = ItemType.TOOL;
  category: ToolCategory;
}
