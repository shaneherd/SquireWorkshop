import {SpeedType} from './speed-type.enum';

export class Speed {
  speedType: SpeedType;
  value: number;

  constructor(speedType: SpeedType, value: number) {
    this.speedType = speedType;
    this.value = value;
  }
}

export class SpeedDisplay {
  speedType: SpeedType;
  value: number;
  hover = false;
}
