import {CreatureItemAction} from './creature-item-action.enum';
import {MagicalItemSpellConfiguration} from '../items/magical-item-spell-configuration';

export class CreatureItemActionRequest {
  creatureItemId = '0';
  action: CreatureItemAction;
  quantity = 0;
  containerId = '0';
  equipmentSlotId = '0';
  charges = 0;
  spells: MagicalItemSpellConfiguration[] = [];
}
