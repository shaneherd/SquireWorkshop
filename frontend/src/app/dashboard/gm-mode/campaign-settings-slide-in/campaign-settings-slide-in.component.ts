import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Campaign} from '../../../shared/models/campaigns/campaign';
import {CampaignService} from '../../../core/services/campaign.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CampaignSettings} from '../../../shared/models/campaigns/campaign-settings';
import * as _ from 'lodash';
import {NotificationService} from '../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {HealthCalculationType} from '../../../shared/models/creatures/characters/health-calculation-type.enum';
import {ExperienceType} from '../../../shared/models/campaigns/experience-type.enum';
import {GroupCheckType} from '../../../shared/models/group-check-type.enum';

@Component({
  selector: 'app-campaign-settings-slide-in',
  templateUrl: './campaign-settings-slide-in.component.html',
  styleUrls: ['./campaign-settings-slide-in.component.scss']
})
export class CampaignSettingsSlideInComponent implements OnInit {
  @Input() campaign: Campaign;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  loading = false;
  settings: CampaignSettings = new CampaignSettings();
  calculationTypes: HealthCalculationType[] = [];
  expTypes: ExperienceType[] = [];
  isExp = false;
  groupTypes: GroupCheckType[] = [];
  isGroupCheck = true;

  constructor(
    private campaignService: CampaignService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.settings = _.cloneDeep(this.campaign.settings);
    this.initializeCalculationTypes();
    this.initializeExpTypes();
    this.initializeGroupTypes();
  }

  private initializeCalculationTypes(): void {
    this.calculationTypes = [];
    this.calculationTypes.push(HealthCalculationType.ROLL);
    this.calculationTypes.push(HealthCalculationType.MAX);
    this.calculationTypes.push(HealthCalculationType.AVERAGE);
  }

  private initializeExpTypes(): void {
    this.expTypes = [];
    this.expTypes.push(ExperienceType.EXP);
    this.expTypes.push(ExperienceType.MILESTONE);
    this.isExp = this.settings.experience.experienceType === ExperienceType.EXP;
  }

  private initializeGroupTypes(): void {
    this.groupTypes = [];
    this.groupTypes.push(GroupCheckType.GROUP);
    this.groupTypes.push(GroupCheckType.LOWEST);
    this.isGroupCheck = this.settings.surpriseRound.groupCheckType === GroupCheckType.GROUP;
  }

  saveClick(): void {
    this.loading = true;
    this.campaignService.updateSettings(this.campaign.id, this.settings).then(() => {
      this.loading = false;
      this.campaign.settings = this.settings;
      this.save.emit();
    }, () => {
      this.notificationService.error(this.translate.instant('Campaign.Settings.Save.Error'));
      this.loading = false;
    });
  }

  closeDetails(): void {
    this.close.emit();
  }

  calculationTypeChange(calculationType: HealthCalculationType): void {
    this.settings.health.healthCalculationType = calculationType;
  }

  groupedHp(event: MatCheckboxChange): void {
    this.settings.health.grouped = event.checked;
  }

  killMonsters(event: MatCheckboxChange): void {
    this.settings.health.killMonsters = event.checked;
  }

  groupedInitiative(event: MatCheckboxChange): void {
    this.settings.initiative.grouped = event.checked;
  }

  natural20First(event: MatCheckboxChange): void {
    this.settings.initiative.natural20First = event.checked;
  }

  hideKilled(event: MatCheckboxChange): void {
    this.settings.initiative.hideKilled = event.checked;
  }

  expTypeChange(experienceType: ExperienceType): void {
    this.settings.experience.experienceType = experienceType;
    this.isExp = this.settings.experience.experienceType === ExperienceType.EXP;
  }

  useAdjusted(event: MatCheckboxChange): void {
    this.settings.experience.useAdjusted = event.checked;
  }

  splitEvenly(event: MatCheckboxChange): void {
    this.settings.experience.splitEvenly = event.checked;
  }

  groupCheckTypeChange(type: GroupCheckType): void {
    this.settings.surpriseRound.groupCheckType = type;
    this.isGroupCheck = this.settings.surpriseRound.groupCheckType === GroupCheckType.GROUP;
  }

  criticalDoubles(event: MatCheckboxChange): void {
    this.settings.surpriseRound.criticalDoubles = event.checked;
  }

}
