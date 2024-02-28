import {StartingEquipmentType} from './starting-equipment-type.enum';
import {ListObject} from '../list-object';
import {Filters} from '../../../core/components/filters/filters';
import {StartingEquipment} from './starting-equipment';
import {Characteristic} from '../characteristics/characteristic';

export class StartingEquipmentItemGroupOptionItem {
  startingEquipmentType: StartingEquipmentType;
  item: ListObject;
  filters: Filters;
  quantity = 0;
  inheritedFrom: Characteristic = null;

  constructor(startingEquipment: StartingEquipment) {
    if (startingEquipment == null) {
      this.startingEquipmentType = StartingEquipmentType.ITEM;
      this.item = new ListObject();
      this.filters = new Filters();
      this.quantity = 1;
    } else {
      this.startingEquipmentType = startingEquipment.startingEquipmentType;
      this.item = startingEquipment.item;
      this.filters = startingEquipment.filters;
      this.quantity = startingEquipment.quantity;
    }
  }
}
