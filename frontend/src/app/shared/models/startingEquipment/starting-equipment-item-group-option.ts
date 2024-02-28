import {StartingEquipmentItemGroupOptionItem} from './starting-equipment-item-group-option-item';
import {Characteristic} from '../characteristics/characteristic';

export class StartingEquipmentItemGroupOption {
  optionNumber = 0;
  label = '';
  items: StartingEquipmentItemGroupOptionItem[] = [];
  inheritedFrom: Characteristic = null;
}
