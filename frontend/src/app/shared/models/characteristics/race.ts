import {Characteristic} from './characteristic';
import {Speed} from '../speed';
import {Size} from '../size.enum';
import {SpeedType} from '../speed-type.enum';
import {CharacteristicType} from './characteristic-type.enum';

export class Race extends Characteristic {
  type = 'Race';
  characteristicType = CharacteristicType.RACE;
  size = Size.MEDIUM;
  description = '';
  speeds: Speed[] = [
    new Speed(SpeedType.WALK, 30),
    new Speed(SpeedType.CRAWL, 0),
    new Speed(SpeedType.CLIMB, 0),
    new Speed(SpeedType.SWIM, 0),
    new Speed(SpeedType.FLY, 0),
    new Speed(SpeedType.BURROW, 0)
  ];
  hover = false;
  startingGold = 0;
  subRaces: Race[] = [];

  constructor() {
    super();
    this.characteristicType = CharacteristicType.RACE;
  }
}
