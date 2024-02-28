import {StartingEquipmentType} from './starting-equipment-type.enum';
import {ListObject} from '../list-object';
import {Filters} from '../../../core/components/filters/filters';

export class StartingEquipmentItem {
  itemType: StartingEquipmentType;
  item: ListObject;
  filters: Filters;
  quantity = 0;
}
