import {InUse} from './in-use';
import {CreatureType} from '../creatures/creature-type.enum';

export class InUseCreature extends InUse {
  creatureType: CreatureType;
}

export class InUseMonster extends InUse {
}
