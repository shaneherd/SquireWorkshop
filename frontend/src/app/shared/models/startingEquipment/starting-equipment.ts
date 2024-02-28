import {Filters} from '../../../core/components/filters/filters';
import {ListObject} from '../list-object';
import {StartingEquipmentType} from './starting-equipment-type.enum';

export class StartingEquipment {
  itemGroup = 0;
  itemOption = 0;
  startingEquipmentType: StartingEquipmentType;
  item: ListObject;
  filters: Filters;
  quantity = 0;
}
