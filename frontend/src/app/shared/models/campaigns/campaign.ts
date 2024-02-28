import {CampaignCharacter} from './campaign-character';
import {CampaignSettings} from './campaign-settings';
import {EncounterListObject} from './encounters/encounter';

export class Campaign {
  id = '0';
  name = '';
  description = '';
  token = '';
  author = false;
  characters: CampaignCharacter[] = [];
  encounters: EncounterListObject[] = [];
  settings: CampaignSettings = new CampaignSettings();
}
