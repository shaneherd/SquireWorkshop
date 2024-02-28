import {ListObject} from '../../list-object';
import {Gender} from './gender.enum';

export class Characteristics {
  height = '';
  eyes = '';
  hair = '';
  skin = '';
  gender: Gender = Gender.NEUTRAL;
  age = 0;
  weight = 0.0;
  deity: ListObject;
}
