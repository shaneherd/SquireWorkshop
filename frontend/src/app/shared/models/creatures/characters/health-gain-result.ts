import {ListObject} from '../../list-object';

export class HealthGainResult {
  level: ListObject;
  value = 0;

  constructor(level: ListObject) {
    this.level = level;
    this.value = 0;
  }
}
