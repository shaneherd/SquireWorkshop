import {StartingEquipmentItem} from './starting-equipment-item';

export class StartingEquipmentGroup {
  id = '0';
  numToChoose = 1;
  groups: StartingEquipmentGroup[] = [];
  items: StartingEquipmentItem[] = [];
  parentGroupId = '0';
}
