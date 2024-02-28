import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../core/guards/pending-changes.guard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {EventsService} from '../../../core/services/events.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../constants';
import * as _ from 'lodash';
import {Campaign} from '../../../shared/models/campaigns/campaign';
import {CampaignService} from '../../../core/services/campaign.service';
import {CampaignCharacter} from '../../../shared/models/campaigns/campaign-character';
import {Encounter, EncounterListObject} from '../../../shared/models/campaigns/encounters/encounter';
import {EncounterService} from '../../../core/services/encounter.service';
import {PageMenuAction} from '../../character/character-playing/character-playing.component';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {YesNoDialogComponent} from '../../../core/components/yes-no-dialog/yes-no-dialog.component';
import {YesNoDialogData} from '../../../core/components/yes-no-dialog/yes-no-dialog-data';

@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
  styleUrls: ['./campaign-info.component.scss']
})
export class CampaignInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public campaignForm: FormGroup;
  id: string;
  campaign: Campaign;
  originalCampaign: Campaign;
  editing = false;
  cancelable = true;
  loading = false;
  routeSub: Subscription;
  eventSub: Subscription;
  itemName = '';
  actions: PageMenuAction[] = [];

  showInvite = false;
  viewingCharacter: CampaignCharacter = null;
  viewingEncounter: Encounter = null;
  startEncounterImmediately = false;
  addingEncounter = false;
  viewingSettings = false;

  clickDisabled = false;

  constructor(
    private dialog: MatDialog,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private encounterService: EncounterService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.editing;
  }

  ngOnInit() {
    this.campaign = new Campaign();
    this.originalCampaign = this.createCopy(this.campaign);
    this.campaignForm = this.createForm();
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateCampaign(new Campaign());
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });

    this.actions = [];
    // this.actions.push(new PageMenuAction(this.translate.instant('Headers.AddCharacter'), (EVENTS.MenuAction.CampaignAddCharacter), 'fas fa-plus'));
    this.actions.push(new PageMenuAction(this.translate.instant('Encounter.Add'), (EVENTS.MenuAction.CampaignAddEncounter), 'fas fa-plus'));
    this.actions.push(new PageMenuAction(this.translate.instant('Campaign.Invite.Invite'), (EVENTS.MenuAction.CampaignInvite), 'fas fa-plus'));
    this.actions.push(new PageMenuAction(this.translate.instant('Headers.Settings'), (EVENTS.MenuAction.CampaignSettings), 'fas fa-cog'));

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.MenuAction.CampaignAddCharacter) {
        //todo
      } else if (event === EVENTS.MenuAction.CampaignAddEncounter) {
        this.addEncounter();
      } else if (event === EVENTS.MenuAction.CampaignInvite) {
        this.invite();
      } else if (event === EVENTS.MenuAction.CampaignSettings) {
        this.settings();
      }
    });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.Campaigns.New');
      this.updateCampaign(new Campaign());
      this.loading = false;
    } else {
      this.campaignService.getCampaign(this.id).then((campaign: Campaign) => {
        if (campaign == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = campaign.name;
          this.updateCampaign(campaign);
        }
        this.loading = false;
      });
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.eventSub.unsubscribe();
  }

  updateCampaign(campaign: Campaign): void {
    this.campaign = campaign;
    this.originalCampaign = this.createCopy(this.campaign);
    this.campaignForm.controls['name'].setValue(campaign.name);
    this.campaignForm.controls['description'].setValue(campaign.description);

    this.cd.detectChanges();
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])],
        description: [null]
      }
    );
  }

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }, NAVIGATION_DELAY);
  }

  save(): void {
    if (this.campaignForm.valid) {
      this.loading = true;
      const values = this.campaignForm.value;
      this.campaign.name = values.name;
      this.campaign.description = values.description;
      if (this.campaign.id == null || this.campaign.id === '0') {
        this.campaignService.createCampaign(this.campaign).then((id: string) => {
          this.id = id;
          this.campaign.id = id;
          this.itemName = this.campaign.name;
          this.editing = false;
          this.cancelable = true;
          this.updateList(id);
          this.originalCampaign = this.createCopy(this.campaign);
          this.navigateToItem(id);
          this.loading = false;
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      } else {
        this.campaignService.updateCampaign(this.campaign).then(() => {
          this.itemName = this.campaign.name;
          this.editing = false;
          this.originalCampaign = this.createCopy(this.campaign);
          this.updateList(this.id);
          this.cd.detectChanges();
          this.loading = false;
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      }
    } else {
      const translatedMessage = this.translate.instant('Error.AllFieldsRequired');
      this.notificationService.error(translatedMessage);
    }
  }

  private navigateToItem(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['campaigns', id], 'side-nav': ['campaigns', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else {
      this.campaign = this.createCopy(this.originalCampaign);
    }
  }

  createCopy(campaign: Campaign): Campaign {
    return _.cloneDeep(campaign);
  }

  delete(): void {
    this.loading = true;
    this.campaignService.deleteCampaign(this.campaign.id).then(() => {
      this.loading = false;
      this.updateList(null);
      this.close();
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Delete');
      this.notificationService.error(translatedMessage);
    });
  }

  duplicate(name: string): void {
    this.loading = true;
    this.campaignService.duplicateCampaign(this.campaign.id, name).then((id: string) => {
      this.loading = false;
      this.updateList(id);
      this.navigateToItem(id);
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Duplicate');
      this.notificationService.error(translatedMessage);
    });
  }

  private updateList(id: string): void {
    this.campaignService.updateMenuItems(id);
  }

  invite(): void {
    this.showInvite = true;
    this.updateClickDisabled();
  }

  closeInvite(): void {
    this.showInvite = false;
    this.updateClickDisabled();
  }

  characterClick(character: CampaignCharacter): void {
    this.viewingCharacter = character;
    this.updateClickDisabled();
  }

  closeCharacter(): void {
    this.viewingCharacter = null;
    this.updateClickDisabled();
  }

  viewCharacter(newTab: boolean): void {
    const creatureId = this.viewingCharacter.creatureId;
    this.viewingCharacter = null;
    this.updateClickDisabled();

    if (newTab) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/home/dashboard', {outlets: {
            'middle-nav': ['characters', creatureId],
            'side-nav': ['characters', creatureId]
          }}], {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': false, 'shared': true}})
      );
      window.open(url, '_blank');
    } else {
      this.router.navigate(['/home/dashboard', {outlets: {
          'middle-nav': ['characters', creatureId],
          'side-nav': ['characters', creatureId]
        }}], {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': false, 'shared': true}});
    }
  }

  removeCharacter(character: CampaignCharacter): void {
    this.campaignService.removeCharacterFromCampaign(this.campaign.id, character.creatureId).then(() => {
      const index = this.campaign.characters.indexOf(character);
      if (index > -1) {
        this.campaign.characters.splice(index, 1);
      }
      this.notificationService.success(this.translate.instant('Campaign.Character.RemoveConfirmation.Success'))
      this.viewingCharacter = null;
      this.updateClickDisabled();
    }, () => {
      this.notificationService.error(this.translate.instant('Campaign.Character.RemoveConfirmation.Error'))
    });
  }

  encounterClick(encounter: EncounterListObject, startImmediately: boolean = false): void {
    this.loading = true;
    this.encounterService.getEncounter(encounter.id).then((_encounter: Encounter) => {
      this.viewingEncounter = _encounter;
      this.startEncounterImmediately = startImmediately;
      if (this.viewingEncounter == null) {
        this.notificationService.error(this.translate.instant('Encounter.Load.Error'));
      }
      this.loading = false;
      this.updateClickDisabled();
    }, () => {
      this.notificationService.error(this.translate.instant('Encounter.Load.Error'));
      this.loading = false;
    });
  }

  closeEncounter(): void {
    this.viewingEncounter = null;
    this.updateClickDisabled();
  }

  startEncounter(): void {
    this.viewingEncounter = null;
    this.updateClickDisabled();
  }

  duplicateEncounter(): void {
    this.viewingEncounter = null;
    this.refreshEncounters();
    this.updateClickDisabled();
  }

  addEncounter(): void {
    this.addingEncounter = true;
    this.updateClickDisabled();
  }

  saveEncounter(encounterId: string): void {
    this.addingEncounter = false;
    this.refreshEncounters();
    this.updateClickDisabled();
    if (encounterId != null) {
      this.promptToStartEncounter(encounterId);
    }
  }

  finishEncounter(): void {
    // this.viewingEncounter = null;
    this.updateClickDisabled();
    this.refreshEncounters();
  }

  private promptToStartEncounter(encounterId: string): void {
    const self = this;
    const data = new YesNoDialogData();
    data.title = this.translate.instant('Encounter.StartPrompt.Title');
    data.message = this.translate.instant('Encounter.StartPrompt.Message');
    data.yes = () => {
      self.startNewEncounter(encounterId);
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(YesNoDialogComponent, dialogConfig);
  }

  private startNewEncounter(encounterId: string): void {
    const encounter = _.find(this.campaign.encounters, (_encounter: EncounterListObject) => {
      return _encounter.id === encounterId;
    });
    if (encounter != null) {
      this.encounterClick(encounter, true);
    }
  }

  private refreshEncounters(): void {
    this.loading = true;
    this.encounterService.getEncounters(this.campaign.id).then((encounters: EncounterListObject[]) => {
      this.loading = false;
      this.campaign.encounters = encounters;
    }, () => {
      this.notificationService.error(this.translate.instant('Campaign.Load.Error'));
      this.loading = false;
    });
  }

  cancelEncounter(): void {
    this.addingEncounter = false;
    this.updateClickDisabled();
  }

  deleteEncounter(): void {
    this.viewingEncounter = null;
    this.refreshEncounters();
    this.updateClickDisabled();
  }

  private settings(): void {
    this.viewingSettings = true;
    this.updateClickDisabled();
  }

  saveSettings(): void {
    this.viewingSettings = false;
    this.updateClickDisabled();
  }

  closeSettings(): void {
    this.viewingSettings = false;
    this.updateClickDisabled();
  }

  private updateClickDisabled(): void {
    this.clickDisabled = this.showInvite || this.addingEncounter || this.viewingEncounter != null || this.viewingCharacter != null || this.viewingSettings;
  }
}
