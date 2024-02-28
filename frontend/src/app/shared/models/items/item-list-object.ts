import {ListObject} from '../list-object';
import {ItemType} from './item-type.enum';
import {ItemQuantity} from './item-quantity';
import {MagicalItemApplicability} from './magical-item-applicability';

export class ItemListObject extends ListObject {
  cost = 0;
  costUnitId = '0'
  itemType: ItemType;
  subItem: ItemListObject = null;
  subItems: ItemQuantity[] = [];
  applicableMagicalItems: MagicalItemApplicability[] = [];
  requireSelectedSpell = false;
  applicableSpells: MagicalItemApplicability[] = [];

  constructor(id: string = '0', name: string = '', sid: number = 0, cost: number = 0, costUnitId: string = '0', subItems: ItemQuantity[] = [], applicableMagicalItems: MagicalItemApplicability[] = [], requireSelectedSpell: boolean = false, applicableSpells: MagicalItemApplicability[] = []) {
    super(id, name, sid);
    this.cost = cost;
    this.costUnitId = costUnitId;
    this.subItems = subItems;
    this.applicableMagicalItems = applicableMagicalItems;
    this.requireSelectedSpell = requireSelectedSpell;
    this.applicableSpells = applicableSpells;
  }
}
