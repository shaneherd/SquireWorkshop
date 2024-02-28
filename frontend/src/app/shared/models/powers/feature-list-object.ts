import {ListObject} from '../list-object';
import {CharacteristicType} from '../characteristics/characteristic-type.enum';
import {Tag} from '../tag';

export class FeatureListObject extends ListObject {
  characteristic: ListObject;
  characteristicType: CharacteristicType;
  passive = false;
  tags: Tag[] = [];
}
