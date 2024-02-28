import {MagicalItemApplicabilityType} from './magical-item-applicability-type.enum';
import {Filters} from '../../../core/components/filters/filters';
import {ItemListObject} from './item-list-object';
import {SpellListObject} from '../powers/spell-list-object';

export class MagicalItemApplicability {
  magicalItemApplicabilityType: MagicalItemApplicabilityType = MagicalItemApplicabilityType.ITEM;
  item: ItemListObject;
  spell: SpellListObject;
  filters: Filters = new Filters()
}

export class MagicalItemApplicabilityDisplay {
  magicalItemApplicability: MagicalItemApplicability;
  display = '';
}
