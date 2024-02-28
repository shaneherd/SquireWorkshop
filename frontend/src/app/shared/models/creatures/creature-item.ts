import {ItemType} from '../items/item-type.enum';
import {EquipmentSlot} from '../items/equipment-slot';
import {Item} from '../items/item';
import {CreatureItemState} from './creature-item-state.enum';
import {MagicalItemSpellConfiguration} from '../items/magical-item-spell-configuration';

export class CreatureItem {
  id = '0';
  name = '';
  item: Item;
  itemType: ItemType = ItemType.GEAR;
  quantity = 0;
  equipmentSlot: EquipmentSlot;
  weight = 0.0;
  containerId = '0';
  container = false;
  ignoreWeightOfItems = false;
  expanded = false;
  poisoned = false;
  silvered = false;
  full = false;
  attuned = false;
  cursed = false;
  chargesRemaining = 0;
  maxCharges = 0;
  magicalItem: Item; //todo - rename this to subItem
  creatureItemState: CreatureItemState = CreatureItemState.CARRIED;
  notes = '';
  items: CreatureItem[] = [];
  spells: MagicalItemSpellConfiguration[] = [];
}
