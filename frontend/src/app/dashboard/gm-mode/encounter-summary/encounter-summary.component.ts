import {Component, Input, OnInit} from '@angular/core';
import {CampaignSettings} from '../../../shared/models/campaigns/campaign-settings';
import {ExperienceType} from '../../../shared/models/campaigns/experience-type.enum';

export enum EncounterDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  DEADLY = 'DEADLY'
}

export class EncounterSummary {
  totalCr = 0;
  totalExp = 0;
  expPerPlayer = 0;
  difficulty: EncounterDifficulty = null;
  adjustedExp = 0;
  adjustedExpPerPlayer = 0;
  partyThreshold: number[] = [0, 0, 0, 0];
}

@Component({
  selector: 'app-encounter-summary',
  templateUrl: './encounter-summary.component.html',
  styleUrls: ['./encounter-summary.component.scss']
})
export class EncounterSummaryComponent {
  @Input() campaignSettings: CampaignSettings;
  @Input() encounterSummary: EncounterSummary;

  constructor() { }
}
