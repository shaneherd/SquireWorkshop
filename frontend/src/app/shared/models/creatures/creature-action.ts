import {CreatureActionType} from './creature-action-type.enum';
import {ListObject} from '../list-object';
import {Action} from '../action.enum';

export class CreatureAction {
  id = '0';
  action: Action;
  creatureActionType: CreatureActionType;
  item: ListObject;
  subItem: ListObject;
  favorite = false;
  favoriteOrder = 0;
  defaultId = '0';
}
