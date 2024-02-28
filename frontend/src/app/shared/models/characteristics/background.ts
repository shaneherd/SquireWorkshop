import {Characteristic} from './characteristic';
import {BackgroundTrait} from './background-trait';
import {CharacteristicType} from './characteristic-type.enum';

export class Background extends Characteristic {
  type = 'Background';
  characteristicType = CharacteristicType.BACKGROUND;
  description = '';
  variations: BackgroundTrait[] = [];
  personalities: BackgroundTrait[] = [];
  ideals: BackgroundTrait[] = [];
  bonds: BackgroundTrait[] = [];
  flaws: BackgroundTrait[] = [];
  startingGold = 0;
  subBackgrounds: Background[] = [];

  constructor() {
    super();
    this.characteristicType = CharacteristicType.BACKGROUND;
  }
}
