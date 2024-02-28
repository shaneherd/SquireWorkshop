import {ListObject} from '../../list-object';
import {CompanionType} from './companion-type.enum';
import {CreatureHealth} from '../creature-health';

export class CompanionListObject extends ListObject {
  companionType: CompanionType;
  creatureHealth: CreatureHealth;
  maxHp = 0;

  constructor(id: string, name: string, companionType: CompanionType, creatureHealth: CreatureHealth, maxHp: number) {
    super(id, name);
    this.companionType = companionType;
    this.creatureHealth = creatureHealth;
    this.maxHp = maxHp;
  }
}
