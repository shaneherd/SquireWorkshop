import {ListObject} from '../list-object';
import {Tag} from '../tag';

export class SpellListObject extends ListObject {
  level = 0;
  tags: Tag[] = [];
}
