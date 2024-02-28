import {ListObject} from './list-object';

export class SpellSlots {
  characterLevel: ListObject;
  slot1: number;
  slot2: number;
  slot3: number;
  slot4: number;
  slot5: number;
  slot6: number;
  slot7: number;
  slot8: number;
  slot9: number;

  constructor(level: ListObject = null) {
    this.characterLevel = level;
    this.slot1 = 0;
    this.slot2 = 0;
    this.slot3 = 0;
    this.slot4 = 0;
    this.slot5 = 0;
    this.slot6 = 0;
    this.slot7 = 0;
    this.slot8 = 0;
    this.slot9 = 0;
  }

  setSlotValue(slot: number, value: number): void {
    if (value == null) {
      value = 0;
    }
    switch (slot) {
      case 1:
        this.slot1 = value;
        break;
      case 2:
        this.slot2 = value;
        break;
      case 3:
        this.slot3 = value;
        break;
      case 4:
        this.slot4 = value;
        break;
      case 5:
        this.slot5 = value;
        break;
      case 6:
        this.slot6 = value;
        break;
      case 7:
        this.slot7 = value;
        break;
      case 8:
        this.slot8 = value;
        break;
      case 9:
        this.slot9 = value;
        break;
    }
  }
}
