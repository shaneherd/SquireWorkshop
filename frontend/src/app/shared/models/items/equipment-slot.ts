import {EquipmentSlotType} from './equipment-slot-type.enum';

export class EquipmentSlot {
  id = '0';
  name = '';
  equipmentSlotType: EquipmentSlotType = EquipmentSlotType.NONE;
}
