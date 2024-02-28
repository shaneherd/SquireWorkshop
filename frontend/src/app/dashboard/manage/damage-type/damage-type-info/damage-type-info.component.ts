import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {Observable, Subscription} from 'rxjs';
import {DamageType} from '../../../../shared/models/attributes/damage-type';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {DamageTypeService} from '../../../../core/services/attributes/damage-type.service';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import * as _ from 'lodash';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingAttributeService} from '../../../../core/services/sharing/sharing-attribute.service';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {VersionInfo} from '../../../../shared/models/version-info';
import {EventsService} from '../../../../core/services/events.service';

@Component({
  selector: 'app-damage-type-info',
  templateUrl: './damage-type-info.component.html',
  styleUrls: ['./damage-type-info.component.scss']
})
export class DamageTypeInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public damageTypeForm: FormGroup;
  id: string;
  damageType: DamageType;
  originalDamageType: DamageType;
  editing = false;
  cancelable = true;
  itemName = '';
  loading = false;
  routeSub: Subscription;
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;

  constructor(
    public attributeService: AttributeService,
    private sharingAttributeService: SharingAttributeService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private damageTypeService: DamageTypeService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) { }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.editing;
  }

  ngOnInit() {
    this.damageType = new DamageType();
    this.originalDamageType = this.createCopy(this.damageType);
    this.damageTypeForm = this.createForm();
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateDamageType(new DamageType());
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.DamageTypes.New');
      this.updateDamageType(new DamageType());
      this.loading = false;
    } else {
      this.attributeService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.damageTypeService.getDamageType(this.id).then((damageType: DamageType) => {
        if (damageType == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = damageType.name;
          this.updateDamageType(damageType);
        }
        this.loading = false;
      });
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  updateDamageType(damageType: DamageType): void {
    this.damageType = damageType;
    this.originalDamageType = this.createCopy(this.damageType);
    this.damageTypeForm.controls['name'].setValue(damageType.name);
    this.damageTypeForm.controls['description'].setValue(damageType.description);
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
    if (this.damageTypeForm.valid) {
      this.loading = true;
      const values = this.damageTypeForm.value;
      this.damageType.name = values.name;
      this.damageType.description = values.description;
      if (this.damageType.id == null || this.damageType.id === '0') {
        this.damageTypeService.createDamageType(this.damageType).then((id: string) => {
          this.id = id;
          this.damageType.id = id;
          this.itemName = this.damageType.name;
          this.editing = false;
          this.cancelable = true;
          this.updateList(id);
          this.originalDamageType = this.createCopy(this.damageType);
          this.navigateToItem(id);
          this.loading = false;
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      } else {
        this.damageTypeService.updateDamageType(this.damageType).then(() => {
          this.itemName = this.damageType.name;
          this.originalDamageType = this.createCopy(this.damageType);
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

  private navigateToItem(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['damageTypes', id], 'side-nav': ['damageTypes', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else {
      this.damageType = this.createCopy(this.originalDamageType);
    }
  }

  createCopy(damageType: DamageType): DamageType {
    return _.cloneDeep(damageType);
  }

  delete(): void {
    this.loading = true;
    this.damageTypeService.deleteDamageType(this.damageType).then(() => {
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
    this.damageTypeService.duplicateDamageType(this.damageType, name).then((id: string) => {
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
    this.damageTypeService.updateMenuItems(id);
  }

  shareClick(): void {
    this.loading = true;
    this.attributeService.getPublishDetails(this.damageType).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.attributeService.publishAttribute(this.damageType, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingAttributeService.addToMyStuff(this.damageType, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingAttributeService.continueAddToMyStuff(this.damageType).then((success: boolean) => {
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
}
