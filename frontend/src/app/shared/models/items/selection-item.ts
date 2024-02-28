import {ItemListObject} from './item-list-object';
import {ItemQuantity} from './item-quantity';
import {SpellListObject} from '../powers/spell-list-object';

export class SelectionItem extends ItemQuantity {
  selected = false;
  selectedApplicableItem: ItemListObject = null;
  selectedSpell: SpellListObject = null;
}
