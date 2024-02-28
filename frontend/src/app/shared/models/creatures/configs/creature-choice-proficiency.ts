import {InheritedFrom} from '../inherited-from';
import {ListObject} from '../../list-object';

export class CreatureChoiceProficiency {
  inheritedFrom: InheritedFrom;
  items: ListObject[] = [];
  quantity = 0;
}
