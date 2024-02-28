import {EncounterCreatureType} from './encounter-creature-type.enum';

export class EncounterCreature {
  id = '0';
  encounterCreatureType: EncounterCreatureType;
  initiative = 0;
  roundAdded = 1;
  order = 0;
  surprised = false;
  removed = false;
}
