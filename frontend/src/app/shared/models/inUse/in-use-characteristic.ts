import {InUse} from './in-use';
import {CharacteristicType} from '../characteristics/characteristic-type.enum';

export class InUseCharacteristic extends InUse {
  characteristicType: CharacteristicType;
}
