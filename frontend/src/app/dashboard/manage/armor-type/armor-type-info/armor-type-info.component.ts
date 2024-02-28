import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArmorType} from '../../../../shared/models/attributes/armor-type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {EVENTS, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {ArmorTypeService} from '../../../../core/services/attributes/armor-type.service';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {ImportService} from '../../../../core/services/import/import.service';
import {ImportItem} from '../../../../shared/imports/import-item';
import * as _ from 'lodash';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingAttributeService} from '../../../../core/services/sharing/sharing-attribute.service';
import {VersionInfo} from '../../../../shared/models/version-info';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {EventsService} from '../../../../core/services/events.service';
import {ExportDialogService} from '../../../../core/services/export/export-dialog.service';
import {ExportAttributeService} from '../../../../core/services/export/export-attribute.service';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {ListObject} from '../../../../shared/models/list-object';
import {MenuItem} from '../../../../shared/models/menuItem.model';

@Component({
  selector: 'app-armor-type-info',
  templateUrl: './armor-type-info.component.html',
  styleUrls: ['./armor-type-info.component.scss']
})
export class ArmorTypeInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public armorTypeForm: FormGroup;
  id: string;
  itemName = '';
  armorType: ArmorType;
  originalArmorType: ArmorType;
  editing = false;
  cancelable = true;
  loading = false;
  routeSub: Subscription;
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
    private armorTypeService: ArmorTypeService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private importService: ImportService,
    private exportDialogService: ExportDialogService,
    private exportDetailsService: ExportAttributeService
  ) {
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.editing;
  }

  ngOnInit() {
    this.armorType = new ArmorType();
    this.armorTypeForm = this.createForm();
    this.originalArmorType = this.createCopy(this.armorType);
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateArmorType(new ArmorType());
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.ArmorTypes.New');
      this.updateArmorType(new ArmorType());
      this.loading = false;
    } else {
      this.attributeService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.armorTypeService.getArmorType(this.id).then((armorType: ArmorType) => {
        if (armorType == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = armorType.name;
          this.updateArmorType(armorType);
        }
        this.loading = false;
      });
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  updateArmorType(armorType: ArmorType): void {
    this.armorType = armorType;
    this.originalArmorType = this.createCopy(this.armorType);
    this.armorTypeForm.controls['name'].setValue(armorType.name);
    this.armorTypeForm.controls['description'].setValue(armorType.description);
    this.armorTypeForm.controls['don'].setValue(armorType.don);
    this.armorTypeForm.controls['donTimeUnit'].setValue(armorType.donTimeUnit);
    this.armorTypeForm.controls['doff'].setValue(armorType.doff);
    this.armorTypeForm.controls['doffTimeUnit'].setValue(armorType.doffTimeUnit);
    this.cd.detectChanges();
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])],
        don: [null, Validators.compose([Validators.required, Validators.max(99), Validators.min(1)])],
        donTimeUnit: [null, Validators.compose([Validators.required])],
        doff: [null, Validators.compose([Validators.required, Validators.max(99), Validators.min(1)])],
        doffTimeUnit: [null, Validators.compose([Validators.required])],
        description: [null]
      }
    );
  }

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    });
  }

  save(): void {
    if (this.armorTypeForm.valid) {
      this.loading = true;
      const values = this.armorTypeForm.value;
      this.armorType.name = values.name;
      this.armorType.description = values.description;
      this.armorType.don = values.don;
      this.armorType.donTimeUnit = values.donTimeUnit;
      this.armorType.doff = values.doff;
      this.armorType.doffTimeUnit = values.doffTimeUnit;
      if (this.armorType.id == null || this.armorType.id === '0' || this.importing) {
        this.armorTypeService.createArmorType(this.armorType).then((id: string) => {
          this.id = id;
          this.armorType.id = id;
          this.itemName = this.armorType.name;
          this.editing = false;
          this.cancelable = true;
          this.updateList(id);
          this.originalArmorType = this.createCopy(this.armorType);
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
        this.armorTypeService.updateArmorType(this.armorType).then(() => {
          this.itemName = this.armorType.name;
          this.originalArmorType = this.createCopy(this.armorType);
          this.editing = false;
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

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else if (this.importing) {
      this.navigateToImporting();
    } else {
      this.armorType = this.createCopy(this.originalArmorType);
    }
  }

  createCopy(armorType: ArmorType): ArmorType {
    return _.cloneDeep(armorType);
  }

  private navigateToItem(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['armorTypes', id], 'side-nav': ['armorTypes', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private navigateToImporting(): void {
    this.router.navigate(['/home/dashboard',
        {outlets: {'middle-nav': ['import'], 'side-nav': ['default']}}],
      {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  delete(): void {
    this.loading = true;
    this.armorTypeService.deleteArmorType(this.armorType).then(() => {
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
    this.armorTypeService.duplicateArmorType(this.armorType, name).then((id: string) => {
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
    this.armorTypeService.updateMenuItems(id);
  }

  shareClick(): void {
    this.loading = true;
    this.attributeService.getPublishDetails(this.armorType).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.attributeService.publishAttribute(this.armorType, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingAttributeService.addToMyStuff(this.armorType, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingAttributeService.continueAddToMyStuff(this.armorType).then((success: boolean) => {
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
    item.listObject = new ListObject(this.armorType.id, this.armorType.name, this.armorType.sid, this.armorType.author);
    item.menuItem = new MenuItem(this.armorType.id, this.armorType.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, false, this.exportDetailsService, 'ArmorTypes', () => {}, this.armorType);
  }
}
