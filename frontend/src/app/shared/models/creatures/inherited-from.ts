import {CharacteristicType} from '../characteristics/characteristic-type.enum';

export class InheritedFrom {
  id = '0';
  name = '';
  type: CharacteristicType;
  primary = true;

  constructor(id: string, name: string, type: CharacteristicType, primary: boolean) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.primary = primary;
  }
}
