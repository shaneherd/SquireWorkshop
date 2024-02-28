import {CampaignCharacter} from '../campaign-character';
import {EncounterCreature} from './encounter-creature';

export class EncounterCharacter extends EncounterCreature {
  character: CampaignCharacter;
  expEarned = 0;
}
