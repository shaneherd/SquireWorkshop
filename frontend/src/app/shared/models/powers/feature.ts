import {ListObject} from '../list-object';
import {CharacteristicType} from '../characteristics/characteristic-type.enum';
import {Power} from './power';
import {Action} from '../action.enum';
import {PowerType} from './power-type.enum';

export class Feature extends Power {
  type = 'Feature';
  characteristic: ListObject = null;
  characteristicType: CharacteristicType = null;
  characterLevel: ListObject = null;
  prerequisite = '';
  description = '';
  passive = false;
  action: Action;
  powerType = PowerType.FEATURE;

  constructor() {
    super();
    this.powerType = PowerType.FEATURE;
  }
}
