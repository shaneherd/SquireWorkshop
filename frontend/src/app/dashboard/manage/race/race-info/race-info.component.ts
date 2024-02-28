import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Race} from '../../../../shared/models/characteristics/race';
import {CharacteristicConfigurationCollection} from '../../../../shared/models/characteristics/characteristic-configuration-collection';
import {ActivatedRoute, Router} from '@angular/router';
import {ProficienciesService} from '../../../../core/services/proficiency.service';
import {CharacteristicService} from '../../../../core/services/characteristics/characteristic.service';
import {RaceService} from '../../../../core/services/characteristics/race.service';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {Speed} from '../../../../shared/models/speed';
import {SpeedType} from '../../../../shared/models/speed-type.enum';
import * as _ from 'lodash';
import {Size} from '../../../../shared/models/size.enum';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {SubRaceService} from '../../../../core/services/characteristics/sub-race.service';
import {ImportItem} from '../../../../shared/imports/import-item';
import {ImportService} from '../../../../core/services/import/import.service';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingCharacteristicService} from '../../../../core/services/sharing/sharing-characteristic.service';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {VersionInfo} from '../../../../shared/models/version-info';
import {EventsService} from '../../../../core/services/events.service';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {ExportDialogService} from '../../../../core/services/export/export-dialog.service';
import {ExportCharacteristicService} from '../../../../core/services/export/export-characteristic.service';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {ListObject} from '../../../../shared/models/list-object';
import {MenuItem} from '../../../../shared/models/menuItem.model';

@Component({
  selector: 'app-race-info',
  templateUrl: './race-info.component.html',
  styleUrls: ['./race-info.component.scss']
})
export class RaceInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public raceForm: FormGroup;
  id: string;
  race: Race;
  originalRace: Race;
  editing = false;
  itemName = '';
  cancelable = true;
  loading = false;
  flySpeedType = SpeedType.FLY;

  characteristicConfigurationCollection = new CharacteristicConfigurationCollection();
  originalCharacteristicConfigurationCollection = new CharacteristicConfigurationCollection();

  sizes: Size[] = [];
  routeSub: Subscription;
  queryParamsSub: Subscription;

  isSubRace = false;
  parentId: string;
  parent: Race = null;

  importing = false;
  importItem: ImportItem = null;
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;
  isPublic = false;
  isShared = false;
  listSource: ListSource = ListSource.MY_STUFF;

  constructor(
    public characteristicService: CharacteristicService,
    private sharingCharacteristicService: SharingCharacteristicService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private proficienciesService: ProficienciesService,
    private raceService: RaceService,
    private subRaceService: SubRaceService,
    private spellService: SpellService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private importService: ImportService,
    private exportDialogService: ExportDialogService,
    private exportDetailsService: ExportCharacteristicService
  ) {
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.editing;
  }

  ngOnInit() {
    this.race = new Race();
    this.originalRace = this.createCopyOfRace(this.race);
    this.raceForm = this.createForm();
    this.initializeSizes();

    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
        if (this.isPublic) {
          this.listSource = ListSource.PUBLIC_CONTENT;
        } else if (this.isShared) {
          this.listSource = ListSource.PRIVATE_CONTENT;
        } else {
          this.listSource = ListSource.MY_STUFF;
        }
      });

    this.routeSub = this.route.params.subscribe((params: { id: string, childId: string }) => {
      this.loading = true;
      this.id = params.id;
      this.isSubRace = params.childId != null;
      if (this.isSubRace) {
        this.id = params.childId;
        this.parentId = params.id;
      }
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.isSubRace) {
      this.subRaceService.getParent(this.parentId).then((parent: Race) => {
        this.parent = parent;
        this.continueInitialization();
      });
    } else {
      this.continueInitialization();
    }
  }

  private continueInitialization(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.Races.New');
      this.updateRace(this.getNewRace());
    } else {
      if (!this.isSubRace) {
        this.characteristicService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
          this.versionInfo = versionInfo;
        });
      }
      this.raceService.getRace(this.id).then((race: Race) => {
        if (race == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        } else {
          this.itemName = race.name;
          this.updateRace(race);
          if (!this.isSubRace) {
            this.subRaceService.updateParentRace(race);
          }
        }
      });
    }
  }

  private getNewRace(): Race {
    const race = new Race();
    race.parent = this.parent;
    if (this.isSubRace) {
      race.speeds[0].value = 0;
    }
    return race;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

  initializeSizes(): void {
    this.sizes = [];
    this.sizes.push(Size.TINY);
    this.sizes.push(Size.SMALL);
    this.sizes.push(Size.MEDIUM);
    this.sizes.push(Size.LARGE);
    this.sizes.push(Size.HUGE);
    this.sizes.push(Size.GARGUANTUAN);
  }

  sizeChange(size: Size): void {
    this.race.size = size;
  }

  speedChange(speed: Speed, input): void {
    speed.value = input.value;
  }

  getParentSpeed(speedType: SpeedType): number {
    if (this.parent == null) {
      return 0;
    }
    for (let i = 0; i < this.parent.speeds.length; i++) {
      const speed = this.parent.speeds[i];
      if (speed.speedType === speedType) {
        return speed.value;
      }
    }
    return 0;
  }

  hoverChange(event: MatCheckboxChange): void {
    this.race.hover = event.checked;
  }

  updateRace(race: Race): void {
    this.loading = true;
    this.race = race;
    const parent: Race = this.race.parent == null ? null : this.race.parent as Race;
    this.characteristicService.setAll(parent);
    this.originalRace = this.createCopyOfRace(this.race);
    this.characteristicService.setAll(this.race.parent);
    this.raceForm.controls['name'].setValue(race.name);
    this.raceForm.controls['size'].setValue(race.size);
    this.raceForm.controls['description'].setValue(race.description);
    this.characteristicService.initializeConfigurationCollection(race, false, this.listSource).then((collection: CharacteristicConfigurationCollection) => {
      this.characteristicConfigurationCollection = collection;
      this.originalCharacteristicConfigurationCollection = this.characteristicService.createCopyOfCollection(collection);
      this.loading = false;
    });
    this.cd.detectChanges();
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])],
        description: [null],
        size: [null, Validators.compose([Validators.required])]
      }
    );
  }

  close(delay: boolean = true): void {
    setTimeout(() => {
      const extras = {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': this.isPublic, 'shared': this.isShared}};
      if (this.isSubRace) {
        if (this.parent == null) {
          this.router.navigate(['/home/dashboard', {outlets: {
              'middle-nav': ['default'],
              'side-nav': ['races'],
            }}], extras);
        } else {
          this.router.navigate(['/home/dashboard', {outlets: {
              'middle-nav': ['races', this.parent.id],
              'side-nav': ['races', this.parent.id]
            }}], extras);
        }
      } else {
        this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}],
          extras);
      }
    }, delay ? NAVIGATION_DELAY : 0);
  }

  save(): void {
    if (this.raceForm.valid) {
      this.loading = true;
      const values = this.raceForm.value;
      this.race.name = values.name;
      this.race.description = values.description;
      this.characteristicService.setFromCollections(this.race, this.characteristicConfigurationCollection);

      if (this.race.id == null || this.race.id === '0' || this.importing) {
        this.raceService.createRace(this.race).then((id: string) => {
          this.id = id;
          this.race.id = id;
          this.cancelable = true;
          this.finishSaving();
        }, () => {
          this.errorSaving();
        });
      } else {
        this.raceService.updateRace(this.race).then(() => {
          this.finishSaving();
        }, () => {
          this.errorSaving();
        });
      }
    } else {
      const translatedMessage = this.translate.instant('Error.AllFieldsRequired');
      this.notificationService.error(translatedMessage);
    }
  }

  private finishSaving(): void {
    this.itemName = this.race.name;
    this.editing = false;

    this.originalCharacteristicConfigurationCollection =
      this.characteristicService.createCopyOfCollection(this.characteristicConfigurationCollection);
    this.originalRace = this.createCopyOfRace(this.race);

    this.updateList(this.id);
    if (!this.importing) {
      this.navigateToItem(this.id);
    } else {
      this.importService.completeItem(this.importItem, this.id);
      this.navigateToImporting();
    }
    this.loading = false;
  }

  private navigateToItem(id: string): void {
    if (this.isSubRace) {
      this.router.navigate(['/home/dashboard', {outlets: {
          'middle-nav': ['races', this.parent.id, id],
          'side-nav': ['races', this.parent.id, id]
        }}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    } else {
      this.router.navigate(['/home/dashboard', {outlets: {
        'middle-nav': ['races', id],
        'side-nav': ['races', id]
      }}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }
  }

  private navigateToImporting(): void {
    this.router.navigate(['/home/dashboard',
        {outlets: {'middle-nav': ['import'], 'side-nav': ['default']}}],
      {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private errorSaving(): void {
    const translatedMessage = this.translate.instant('Error.Save');
    this.notificationService.error(translatedMessage);
    this.loading = false;
  }

  delete(): void {
    this.loading = true;
    this.raceService.deleteRace(this.race).then(() => {
      this.loading = false;
      this.updateList(null);
      this.close();
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Delete');
      this.notificationService.error(translatedMessage);
    });
  }

  cancel(): void {
    if (this.id === '0') {
      this.close(false);
    } else if (this.importing) {
      this.navigateToImporting();
    } else {
      this.characteristicConfigurationCollection =
        this.characteristicService.createCopyOfCollection(this.originalCharacteristicConfigurationCollection);
      this.race = this.createCopyOfRace(this.originalRace);
    }
  }

  createCopyOfRace(race: Race): Race {
    return _.cloneDeep(race);
  }

  duplicate(name: string): void {
    this.loading = true;
    this.raceService.duplicateRace(this.race, name).then((id: string) => {
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
    if (this.isSubRace) {
      this.subRaceService.updateMenuItems(id);
    } else {
      this.raceService.updateMenuItems(id);
    }
  }

  subRaceClick(subRace: Race): void {
    if (!this.editing) {
      const subRaceId = subRace == null ? '0' : subRace.id;
      const extras = {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': this.isPublic, 'shared': this.isShared}};
      this.router.navigate(['/home/dashboard', {outlets: {
          'middle-nav': ['races', this.race.id, subRaceId],
          'side-nav': ['races', this.race.id, subRaceId]
        }}], extras);
    }
  }

  addSubRace(): void {
    this.subRaceClick(null);
  }

  handleConfigListUpdated(): void {
    this.originalCharacteristicConfigurationCollection.spellConfigurationCollection = _.cloneDeep(this.characteristicConfigurationCollection.spellConfigurationCollection);
  }

  shareClick(): void {
    this.loading = true;
    this.characteristicService.getPublishDetails(this.race).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.characteristicService.publishCharacteristic(this.race, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingCharacteristicService.addToMyStuff(this.race, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingCharacteristicService.continueAddToMyStuff(this.race).then((success: boolean) => {
        this.eventsService.dispatchEvent(EVENTS.AddToMyStuffFinish);
        if (success) {
          this.versionInfo.version = this.versionInfo.authorVersion;
          this.eventsService.dispatchEvent(EVENTS.VersionUpdated);
          this.notificationService.success(this.translate.instant('Success'));
          this.loading = false;
          this.initializeData();
        } else {
          this.notificationService.error(this.translate.instant('Error.Unknown'));
          this.loading = false;
        }
      });
    });
  }

  exportClick(): void {
    const item = new ManageListItem();
    item.listObject = new ListObject(this.race.id, this.race.name, this.race.sid, this.race.author);
    item.menuItem = new MenuItem(this.race.id, this.race.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, false, this.exportDetailsService, 'Races', () => {}, this.race);
  }
}
