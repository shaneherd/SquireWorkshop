import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {Background} from '../../../../shared/models/characteristics/background';
import {BackgroundService} from '../../../../core/services/characteristics/background.service';
import {ProficienciesService} from '../../../../core/services/proficiency.service';
import {BackgroundTrait} from '../../../../shared/models/characteristics/background-trait';
import {BackgroundTraitType} from '../../../../shared/models/characteristics/background-trait-type.enum';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {CharacteristicService} from '../../../../core/services/characteristics/characteristic.service';
import {Characteristic} from '../../../../shared/models/characteristics/characteristic';
import {CharacteristicType} from '../../../../shared/models/characteristics/characteristic-type.enum';
import {CharacteristicConfigurationCollection} from '../../../../shared/models/characteristics/characteristic-configuration-collection';
import * as _ from 'lodash';
import {HttpErrorResponse} from '@angular/common/http';
import {ImportItem} from '../../../../shared/imports/import-item';
import {ImportService} from '../../../../core/services/import/import.service';
import {SubBackgroundService} from '../../../../core/services/characteristics/sub-background.service';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingCharacteristicService} from '../../../../core/services/sharing/sharing-characteristic.service';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {VersionInfo} from '../../../../shared/models/version-info';
import {EventsService} from '../../../../core/services/events.service';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {ListObject} from '../../../../shared/models/list-object';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportDialogService} from '../../../../core/services/export/export-dialog.service';
import {ExportCharacteristicService} from '../../../../core/services/export/export-characteristic.service';

export class BackgroundTraitCollection {
  variations: BackgroundTrait[] = [];
  personalities: BackgroundTrait[] = [];
  ideals: BackgroundTrait[] = [];
  bonds: BackgroundTrait[] = [];
  flaws: BackgroundTrait[] = [];

  parentVariations: BackgroundTrait[] = [];
  parentPersonalities: BackgroundTrait[] = [];
  parentIdeals: BackgroundTrait[] = [];
  parentBonds: BackgroundTrait[] = [];
  parentFlaws: BackgroundTrait[] = [];
}

@Component({
  selector: 'app-background-info',
  templateUrl: './background-info.component.html',
  styleUrls: ['./background-info.component.scss']
})
export class BackgroundInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public backgroundForm: FormGroup;
  id: string;
  itemName = '';
  background: Background;
  originalBackground: Background;
  editing = false;
  cancelable = true;
  loading = false;
  VARIATION = BackgroundTraitType.VARIATION;
  PERSONALITY = BackgroundTraitType.PERSONALITY;
  IDEAL = BackgroundTraitType.IDEAL;
  BOND = BackgroundTraitType.BOND;
  FLAW = BackgroundTraitType.FLAW;
  routeSub: Subscription;
  queryParamsSub: Subscription;

  traitCollection = new BackgroundTraitCollection();
  originalTraitCollection = new BackgroundTraitCollection();

  characteristicConfigurationCollection = new CharacteristicConfigurationCollection();
  originalCharacteristicConfigurationCollection = new CharacteristicConfigurationCollection();

  importing = false;
  importItem: ImportItem = null;

  isSubBackground = false;
  parentId: string;
  parent: Background = null;
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
    private backgroundService: BackgroundService,
    private subBackgroundService: SubBackgroundService,
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
    this.background = new Background();
    this.originalBackground = this.createCopyOfBackground(this.background);
    this.backgroundForm = this.createForm();

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
      this.isSubBackground = params.childId != null;
      if (this.isSubBackground) {
        this.id = params.childId;
        this.parentId = params.id;
      }
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.isSubBackground) {
      this.subBackgroundService.getParent(this.parentId).then((parent: Background) => {
        this.parent = parent;
        this.continueInitialization();
      });
    } else {
      this.continueInitialization();
    }
  }

  private continueInitialization(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.Backgrounds.New');
      this.updateBackground(this.getNewBackground());
    } else {
      if (!this.isSubBackground) {
        this.characteristicService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
          this.versionInfo = versionInfo;
        });
      }
      this.backgroundService.getBackground(this.id).then((background: Background) => {
        if (background == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        } else {
          this.itemName = background.name;
          this.updateBackground(background);
          if (!this.isSubBackground) {
            this.subBackgroundService.updateParentBackground(background);
          }
        }
      });
    }
  }

  private getNewBackground(): Background {
    const background = new Background();
    background.parent = this.parent;
    return background;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

  initializeTraits(): void {
    this.traitCollection.variations = this.background.variations;
    this.traitCollection.personalities = this.background.personalities;
    this.traitCollection.ideals = this.background.ideals;
    this.traitCollection.bonds = this.background.bonds;
    this.traitCollection.flaws = this.background.flaws;
    this.updateParentTraits(this.background.parent);

    this.originalTraitCollection = this.backgroundService.createCopyOfTraitCollection(this.traitCollection);
  }

  updateParentTraits(parent: Characteristic): void {
    if (parent != null && parent.characteristicType === CharacteristicType.BACKGROUND) {
      this.traitCollection.parentVariations = this.backgroundService.getAllVariations(parent as Background);
      this.traitCollection.parentPersonalities = this.backgroundService.getAllPersonalities(parent as Background);
      this.traitCollection.parentIdeals = this.backgroundService.getAllIdeals(parent as Background);
      this.traitCollection.parentBonds = this.backgroundService.getAllBonds(parent as Background);
      this.traitCollection.parentFlaws = this.backgroundService.getAllFlaws(parent as Background);
    } else {
      this.traitCollection.parentVariations = [];
      this.traitCollection.parentPersonalities = [];
      this.traitCollection.parentIdeals = [];
      this.traitCollection.parentBonds = [];
      this.traitCollection.parentFlaws = [];
    }
  }

  updateBackground(background: Background): void {
    this.loading = true;
    this.background = background;
    const parent: Background = this.background.parent == null ? null : this.background.parent as Background;
    this.characteristicService.setAll(parent);
    this.originalBackground = this.createCopyOfBackground(this.background);
    this.characteristicService.setAll(this.background.parent);
    this.characteristicService.setAll(this.background.parent);
    this.backgroundForm.controls['name'].setValue(background.name);
    this.backgroundForm.controls['description'].setValue(background.description);
    this.initializeTraits();
    this.characteristicService.initializeConfigurationCollection(background, false, this.listSource).then((collection: CharacteristicConfigurationCollection) => {
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
        description: [null]
      }
    );
  }

  close(): void {
    setTimeout(() => {
      const extras = {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': this.isPublic, 'shared': this.isShared}};
      if (this.isSubBackground) {
        if (this.parent == null) {
          this.router.navigate(['/home/dashboard', {outlets: {
              'middle-nav': ['default'],
              'side-nav': ['backgrounds'],
            }}], extras);
        } else {
          this.router.navigate(['/home/dashboard', {outlets: {
              'middle-nav': ['backgrounds', this.parent.id],
              'side-nav': ['backgrounds', this.parent.id]
            }}], extras);
        }
      } else {
        this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}],
          extras);
      }
    });
  }

  save(): void {
    if (this.backgroundForm.valid) {
      this.loading = true;
      const values = this.backgroundForm.value;
      this.background.name = values.name;
      this.background.description = values.description;

      //traits
      this.background.variations = this.getTraits(this.traitCollection.variations);
      this.background.personalities = this.getTraits(this.traitCollection.personalities);
      this.background.ideals = this.getTraits(this.traitCollection.ideals);
      this.background.bonds = this.getTraits(this.traitCollection.bonds);
      this.background.flaws = this.getTraits(this.traitCollection.flaws);

      this.characteristicService.setFromCollections(this.background, this.characteristicConfigurationCollection);

      if (this.background.id == null || this.background.id === '0' || this.importing) {
        this.backgroundService.createBackground(this.background).then((id: string) => {
          this.id = id;
          this.background.id = id;
          this.cancelable = true;
          this.finishSaving();
        }, (error: HttpErrorResponse) => {
          this.errorSaving(error);
        });
      } else {
        this.backgroundService.updateBackground(this.background).then(() => {
          this.finishSaving();
        }, (error: HttpErrorResponse) => {
          this.errorSaving(error);
        });
      }
    } else {
      const translatedMessage = this.translate.instant('Error.AllFieldsRequired');
      this.notificationService.error(translatedMessage);
    }
  }

  private finishSaving(): void {
    this.itemName = this.background.name;
    this.editing = false;

    this.originalCharacteristicConfigurationCollection =
      this.characteristicService.createCopyOfCollection(this.characteristicConfigurationCollection);
    this.originalTraitCollection = this.backgroundService.createCopyOfTraitCollection(this.traitCollection);
    this.originalBackground = this.createCopyOfBackground(this.background);

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
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['backgrounds', id], 'side-nav': ['backgrounds', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private navigateToImporting(): void {
    this.router.navigate(['/home/dashboard',
        {outlets: {'middle-nav': ['import'], 'side-nav': ['default']}}],
      {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private errorSaving(error: HttpErrorResponse): void {
    let translatedMessage = '';
    switch (error.status) {
      case 418:
        translatedMessage = this.translate.instant('Error.UnableToDeleteTraits')
        break;
      default:
        translatedMessage = this.translate.instant('Error.Save');
        break;
    }
    this.notificationService.error(translatedMessage);
    this.loading = false;
  }

  getTraits(traits: BackgroundTrait[]): BackgroundTrait[] {
    const finalTraits: BackgroundTrait[] = [];
    traits.forEach((trait: BackgroundTrait) => {
      if (trait.description !== '') {
        finalTraits.push(trait);
      }
    });
    return finalTraits;
  }

  delete(): void {
    this.loading = true;
    this.backgroundService.deleteBackground(this.background).then(() => {
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
      this.close();
    } else if (this.importing) {
      this.navigateToImporting();
    } else {
      this.characteristicConfigurationCollection =
        this.characteristicService.createCopyOfCollection(this.originalCharacteristicConfigurationCollection);
      this.traitCollection = this.backgroundService.createCopyOfTraitCollection(this.originalTraitCollection);
      this.background = this.createCopyOfBackground(this.originalBackground);
    }
  }

  createCopyOfBackground(background: Background): Background {
    return _.cloneDeep(background);
  }

  duplicate(name: string): void {
    this.loading = true;
    this.backgroundService.duplicateBackground(this.background, name).then((id: string) => {
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
    this.backgroundService.updateMenuItems(id);
  }

  handleConfigListUpdated(): void {
    this.originalCharacteristicConfigurationCollection.spellConfigurationCollection = _.cloneDeep(this.characteristicConfigurationCollection.spellConfigurationCollection);
  }

  subBackgroundClick(subBackground: Background): void {
    if (!this.editing) {
      const subBackgroundId = subBackground == null ? '0' : subBackground.id;
      const extras = {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': this.isPublic, 'shared': this.isShared}};
      this.router.navigate(['/home/dashboard', {outlets: {
          'middle-nav': ['backgrounds', this.background.id, subBackgroundId],
          'side-nav': ['backgrounds', this.background.id, subBackgroundId]
        }}], extras);
    }
  }

  addSubBackground(): void {
    this.subBackgroundClick(null);
  }

  shareClick(): void {
    this.loading = true;
    this.characteristicService.getPublishDetails(this.background).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.characteristicService.publishCharacteristic(this.background, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingCharacteristicService.addToMyStuff(this.background, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingCharacteristicService.continueAddToMyStuff(this.background).then((success: boolean) => {
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
    item.listObject = new ListObject(this.background.id, this.background.name, this.background.sid, this.background.author);
    item.menuItem = new MenuItem(this.background.id, this.background.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, false, this.exportDetailsService, 'Backgrounds', () => {}, this.background);
  }
}
