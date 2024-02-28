import {StartingEquipmentItemGroupOption} from './starting-equipment-item-group-option';
import {Characteristic} from '../characteristics/characteristic';

export class StartingEquipmentItemGroup {
  groupNumber = 0;
  options: StartingEquipmentItemGroupOption[] = [];
  inheritedFrom: Characteristic = null;
}
