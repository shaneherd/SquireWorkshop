import {ExperienceType} from './experience-type.enum';
import {HealthCalculationType} from '../creatures/characters/health-calculation-type.enum';
import {GroupCheckType} from '../group-check-type.enum';

export class CampaignSettings {
  health: CampaignHealthSettings = new CampaignHealthSettings();
  initiative: CampaignInitiativeSettings = new CampaignInitiativeSettings();
  experience: CampaignExperienceSettings = new CampaignExperienceSettings();
  surpriseRound: CampaignSurpriseRoundSettings = new CampaignSurpriseRoundSettings();
}

export class CampaignHealthSettings {
  healthCalculationType: HealthCalculationType = HealthCalculationType.AVERAGE;
  grouped = true;
  killMonsters = true;
}

export class CampaignInitiativeSettings {
  grouped = true;
  natural20First = true;
  hideKilled = true;
}

export class CampaignExperienceSettings {
  experienceType: ExperienceType = ExperienceType.EXP;
  useAdjusted = false;
  splitEvenly = true;
}

export class CampaignSurpriseRoundSettings {
  groupCheckType: GroupCheckType = GroupCheckType.GROUP;
  criticalDoubles = true;
}
