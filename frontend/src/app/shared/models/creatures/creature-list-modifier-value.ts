import {InheritedFrom} from './inherited-from';
import {CharacteristicType} from '../characteristics/characteristic-type.enum';

export class CreatureListModifierValue {
  inheritedFrom: InheritedFrom = new InheritedFrom('0', '', CharacteristicType.CLASS, true);
  value = 0;

  constructor(inheritedFrom: InheritedFrom, value: number) {
    this.inheritedFrom = inheritedFrom;
    this.value = value;
  }
}
