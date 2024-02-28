import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {CasterType} from '../../../../shared/models/attributes/caster-type';
import {CasterTypeService} from '../../../../core/services/attributes/caster-type.service';
import {SpellSlots} from '../../../../shared/models/spell-slots';
import {CharacterLevelService} from '../../../../core/services/character-level.service';
import {CharacterLevel} from '../../../../shared/models/character-level';
import {ListObject} from '../../../../shared/models/list-object';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {ImportService} from '../../../../core/services/import/import.service';
import {ImportItem} from '../../../../shared/imports/import-item';
import * as _ from 'lodash';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingAttributeService} from '../../../../core/services/sharing/sharing-attribute.service';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {VersionInfo} from '../../../../shared/models/version-info';
import {EventsService} from '../../../../core/services/events.service';
import {ExportDialogService} from '../../../../core/services/export/export-dialog.service';
import {ExportAttributeService} from '../../../../core/services/export/export-attribute.service';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {MenuItem} from '../../../../shared/models/menuItem.model';

@Component({
  selector: 'app-caster-type-info',
  templateUrl: './caster-type-info.component.html',
  styleUrls: ['./caster-type-info.component.scss']
})
export class CasterTypeInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public casterTypeForm: FormGroup;
  id: string;
  casterType: CasterType;
  originalCasterType: CasterType;
  editing = false;
  cancelable = true;
  loading = false;
  routeSub: Subscription;
  levels: CharacterLevel[] = [];
  itemName = '';
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;

  importing = false;
  importItem: ImportItem = null;

  constructor(
    public attributeService: AttributeService,
    private sharingAttributeService: SharingAttributeService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private casterTypeService: CasterTypeService,
    private characterLevelService: CharacterLevelService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private importService: ImportService,
    private exportDialogService: ExportDialogService,
    private exportDetailsService: ExportAttributeService
  ) { }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.editing;
  }

  ngOnInit() {
    this.levels = this.characterLevelService.getLevelsDetailedFromStorage();
    this.casterType = new CasterType(this.levels);
    this.originalCasterType = this.createCopy(this.casterType);
    this.casterTypeForm = this.createForm();
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateCasterType(new CasterType(this.levels));
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.CasterTypes.New');
      this.updateCasterType(new CasterType(this.levels));
      this.loading = false;
    } else {
      this.attributeService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.casterTypeService.getCasterType(this.id).then((casterType: CasterType) => {
        if (casterType == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = casterType.name;
          this.updateCasterType(casterType);
        }
        this.loading = false;
      });
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  private getValue(value: number): number {
    return value === 0 ? null : value;
  }

  updateCasterType(casterType: CasterType): void {
    this.casterType = casterType;
    this.originalCasterType = this.createCopy(this.casterType);
    this.casterTypeForm.controls['name'].setValue(casterType.name);
    this.casterTypeForm.controls['description'].setValue(casterType.description);
    this.casterTypeForm.controls['countsTowardsMultiClass'].setValue(casterType.multiClassWeight > 0);
    this.casterTypeForm.controls['multiClassWeight'].setValue(this.getValue(casterType.multiClassWeight));
    this.casterTypeForm.controls['roundUp'].setValue(casterType.roundUp);

    casterType.spellSlots.forEach((spellSlots, i) => {
      const temp = this.casterTypeForm.controls['spellSlots'] as FormGroup;
      const level = ((temp.controls[i] as FormGroup).controls['level'] as FormGroup).controls;
      (level[0] as FormGroup).controls['value'].setValue(this.getValue(spellSlots.slot1));
      (level[1] as FormGroup).controls['value'].setValue(this.getValue(spellSlots.slot2));
      (level[2] as FormGroup).controls['value'].setValue(this.getValue(spellSlots.slot3));
      (level[3] as FormGroup).controls['value'].setValue(this.getValue(spellSlots.slot4));
      (level[4] as FormGroup).controls['value'].setValue(this.getValue(spellSlots.slot5));
      (level[5] as FormGroup).controls['value'].setValue(this.getValue(spellSlots.slot6));
      (level[6] as FormGroup).controls['value'].setValue(this.getValue(spellSlots.slot7));
      (level[7] as FormGroup).controls['value'].setValue(this.getValue(spellSlots.slot8));
      (level[8] as FormGroup).controls['value'].setValue(this.getValue(spellSlots.slot9));
    });
    this.cd.detectChanges();
  }

  createForm(): FormGroup {
    const spellSlots = [];
    for (let i = 0; i < this.levels.length; i++) {
      const level = [];
      for (let j = 0; j < 9; j++) {
        level.push({});
      }
      spellSlots.push(level);
    }

    const controls = spellSlots.map(level => {
      const nestedFormArray = new FormArray(level.map(slot => {
        return this.fb.group({
          value: [null]
        })
      }));
      return this.fb.group({
        level: nestedFormArray
      });
    });

    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])],
        countsTowardsMultiClass: [null],
        multiClassWeight: [null],
        roundUp: [null, Validators.compose([Validators.required])],
        spellSlots: new FormArray(controls),
        description: [null]
      }
    );
  }

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }, NAVIGATION_DELAY);
  }

  private getSpellSlots(values): SpellSlots[] {
    const spellSlots = [];
    values.spellSlots.forEach((level, i) => {
      const lvl = new ListObject(this.levels[i].id, this.levels[i].name, this.levels[i].sid);
      const spellSlot = new SpellSlots(lvl);
      level.level.forEach((slot, j) => {
        const value = slot.value;
        spellSlot.setSlotValue(j + 1, value);
      });
      spellSlots.push(spellSlot);
    });
    return spellSlots;
  }

  save(): void {
    if (this.casterTypeForm.valid) {
      this.loading = true;
      const values = this.casterTypeForm.value;
      this.casterType.name = values.name;
      this.casterType.description = values.description;
      this.casterType.multiClassWeight = !values.countsTowardsMultiClass || values.multiClassWeight == null ? 0 : values.multiClassWeight;
      this.casterType.roundUp = values.countsTowardsMultiClass && values.roundUp;

      this.casterType.spellSlots = this.getSpellSlots(values);
      if (this.casterType.id == null || this.casterType.id === '0' || this.importing) {
        this.casterTypeService.createCasterType(this.casterType).then((id: string) => {
          this.id = id;
          this.casterType.id = id;
          this.itemName = this.casterType.name;
          this.editing = false;
          this.cancelable = true;
          this.updateList(id);
          this.originalCasterType = this.createCopy(this.casterType);
          if (!this.importing) {
            this.navigateToItem(id);
          } else {
            this.importService.completeItem(this.importItem, id);
            this.navigateToImporting();
          }
          this.loading = false;
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      } else {
        this.casterTypeService.updateCasterType(this.casterType).then(() => {
          this.itemName = this.casterType.name;
          this.originalCasterType = this.createCopy(this.casterType);
          this.editing = false;
          this.updateList(this.id);
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
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['casterTypes', id], 'side-nav': ['casterTypes', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else if (this.importing) {
      this.navigateToImporting();
    } else {
      this.casterType = this.createCopy(this.originalCasterType);
    }
  }

  createCopy(casterType: CasterType): CasterType {
    return _.cloneDeep(casterType);
  }

  private navigateToImporting(): void {
    this.router.navigate(['/home/dashboard',
        {outlets: {'middle-nav': ['import'], 'side-nav': ['default']}}],
      {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  delete(): void {
    this.loading = true;
    this.casterTypeService.deleteCasterType(this.casterType).then(() => {
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
    this.casterTypeService.duplicateCasterType(this.casterType, name).then((id: string) => {
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
    this.casterTypeService.updateMenuItems(id);
  }

  shareClick(): void {
    this.loading = true;
    this.attributeService.getPublishDetails(this.casterType).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.attributeService.publishAttribute(this.casterType, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingAttributeService.addToMyStuff(this.casterType, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingAttributeService.continueAddToMyStuff(this.casterType).then((success: boolean) => {
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
    item.listObject = new ListObject(this.casterType.id, this.casterType.name, this.casterType.sid, this.casterType.author);
    item.menuItem = new MenuItem(this.casterType.id, this.casterType.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, false, this.exportDetailsService, 'CasterTypes', () => {}, this.casterType);
  }
}
