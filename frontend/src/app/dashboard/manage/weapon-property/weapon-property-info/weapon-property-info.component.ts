import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {WeaponProperty} from '../../../../shared/models/attributes/weapon-property';
import {WeaponPropertyService} from '../../../../core/services/attributes/weapon-property.service';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {ImportItem} from '../../../../shared/imports/import-item';
import {ImportService} from '../../../../core/services/import/import.service';
import * as _ from 'lodash';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingAttributeService} from '../../../../core/services/sharing/sharing-attribute.service';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {VersionInfo} from '../../../../shared/models/version-info';
import {EventsService} from '../../../../core/services/events.service';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {ListObject} from '../../../../shared/models/list-object';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportDialogService} from '../../../../core/services/export/export-dialog.service';
import {ExportAttributeService} from '../../../../core/services/export/export-attribute.service';

@Component({
  selector: 'app-weapon-property-info',
  templateUrl: './weapon-property-info.component.html',
  styleUrls: ['./weapon-property-info.component.scss']
})
export class WeaponPropertyInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public weaponPropertyForm: FormGroup;
  id: string;
  weaponProperty: WeaponProperty;
  originalWeaponProperty: WeaponProperty;
  editing = false;
  cancelable = true;
  itemName = '';
  loading = false;
  routeSub: Subscription;

  importing = false;
  importItem: ImportItem = null;
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;

  constructor(
    public attributeService: AttributeService,
    private sharingAttributeService: SharingAttributeService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private weaponPropertyService: WeaponPropertyService,
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
    this.weaponProperty = new WeaponProperty();
    this.originalWeaponProperty = this.createCopy(this.weaponProperty);
    this.weaponPropertyForm = this.createForm();
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateWeaponProperty(new WeaponProperty());
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.WeaponProperties.New');
      this.updateWeaponProperty(new WeaponProperty());
      this.loading = false;
    } else {
      this.attributeService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.weaponPropertyService.getWeaponProperty(this.id).then((weaponProperty: WeaponProperty) => {
        if (weaponProperty == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = weaponProperty.name;
          this.updateWeaponProperty(weaponProperty);
        }
        this.loading = false;
      });
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  updateWeaponProperty(weaponProperty: WeaponProperty): void {
    this.weaponProperty = weaponProperty;
    this.originalWeaponProperty = this.createCopy(this.weaponProperty);
    this.weaponPropertyForm.controls['name'].setValue(weaponProperty.name);
    this.weaponPropertyForm.controls['description'].setValue(weaponProperty.description);
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
    if (this.weaponPropertyForm.valid) {
      this.loading = true;
      const values = this.weaponPropertyForm.value;
      this.weaponProperty.name = values.name;
      this.weaponProperty.description = values.description;
      if (this.weaponProperty.id == null || this.weaponProperty.id === '0' || this.importing) {
        this.weaponPropertyService.createWeaponProperty(this.weaponProperty).then((id: string) => {
          this.id = id;
          this.weaponProperty.id = id;
          this.itemName = this.weaponProperty.name;
          this.editing = false;
          this.cancelable = true;
          this.originalWeaponProperty = this.createCopy(this.weaponProperty);
          this.updateList(id);
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
        this.weaponPropertyService.updateWeaponProperty(this.weaponProperty).then(() => {
          this.itemName = this.weaponProperty.name;
          this.originalWeaponProperty = this.createCopy(this.weaponProperty);
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
      this.weaponProperty = this.createCopy(this.originalWeaponProperty);
    }
  }

  private navigateToItem(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['weaponProperties', id], 'side-nav': ['weaponProperties', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private navigateToImporting(): void {
    this.router.navigate(['/home/dashboard',
        {outlets: {'middle-nav': ['import'], 'side-nav': ['default']}}],
      {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  createCopy(weaponProperty: WeaponProperty): WeaponProperty {
    return _.cloneDeep(weaponProperty);
  }

  delete(): void {
    this.loading = true;
    this.weaponPropertyService.deleteWeaponProperty(this.weaponProperty).then(() => {
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
    this.weaponPropertyService.duplicateWeaponProperty(this.weaponProperty, name).then((id: string) => {
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
    this.weaponPropertyService.updateMenuItems(id);
  }

  shareClick(): void {
    this.loading = true;
    this.attributeService.getPublishDetails(this.weaponProperty).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.attributeService.publishAttribute(this.weaponProperty, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingAttributeService.addToMyStuff(this.weaponProperty, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingAttributeService.continueAddToMyStuff(this.weaponProperty).then((success: boolean) => {
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
    item.listObject = new ListObject(this.weaponProperty.id, this.weaponProperty.name, this.weaponProperty.sid, this.weaponProperty.author);
    item.menuItem = new MenuItem(this.weaponProperty.id, this.weaponProperty.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, true, this.exportDetailsService, 'WeaponProperties', () => {}, this.weaponProperty);
  }
}
