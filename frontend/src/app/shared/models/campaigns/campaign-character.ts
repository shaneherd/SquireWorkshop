import {ListObject} from '../list-object';
import {CampaignCharacterType} from './campaign-character-type.enum';
import {Proficiency} from '../proficiency';

export class CampaignCharacter {
  id = '0';
  creatureId = '0';
  name = '';
  campaignCharacterType: CampaignCharacterType;
  exp = 0;

  initiative: Proficiency = new Proficiency();
  perception: Proficiency = new Proficiency();
  stealth: Proficiency = new Proficiency();
  profMisc = 0;

  characterClass: ListObject = null;
  subclass: ListObject = null;
  race: ListObject = null;
  background: ListObject = null;
  characterExp = 0;
}
