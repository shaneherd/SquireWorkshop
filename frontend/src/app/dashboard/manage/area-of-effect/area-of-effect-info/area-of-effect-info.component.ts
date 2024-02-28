import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {AreaOfEffect} from '../../../../shared/models/attributes/area-of-effect';
import {AreaOfEffectService} from '../../../../core/services/attributes/area-of-effect.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import * as _ from 'lodash';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingAttributeService} from '../../../../core/services/sharing/sharing-attribute.service';
import {VersionInfo} from '../../../../shared/models/version-info';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {EventsService} from '../../../../core/services/events.service';

@Component({
  selector: 'app-area-of-effect-info',
  templateUrl: './area-of-effect-info.component.html',
  styleUrls: ['./area-of-effect-info.component.scss']
})
export class AreaOfEffectInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public areaOfEffectForm: FormGroup;
  id: string;
  areaOfEffect: AreaOfEffect;
  originalAreaOfEffect: AreaOfEffect;
  editing = false;
  cancelable = true;
  loading = false;
  routeSub: Subscription;
  itemName = '';
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;

  constructor(
    public attributeService: AttributeService,
    private eventsService: EventsService,
    private sharingAttributeService: SharingAttributeService,
    private route: ActivatedRoute,
    private areaOfEffectService: AreaOfEffectService,
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
    this.areaOfEffect = new AreaOfEffect();
    this.originalAreaOfEffect = this.createCopy(this.areaOfEffect);
    this.areaOfEffectForm = this.createForm();
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateAreaOfEffect(new AreaOfEffect());
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.AreaOfEffects.New');
      this.updateAreaOfEffect(new AreaOfEffect());
      this.loading = false;
    } else {
      this.attributeService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.areaOfEffectService.getAreaOfEffect(this.id).then((areaOfEffect: AreaOfEffect) => {
        if (areaOfEffect == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = areaOfEffect.name;
          this.updateAreaOfEffect(areaOfEffect);
        }
        this.loading = false;
      });
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  updateAreaOfEffect(areaOfEffect: AreaOfEffect): void {
    this.areaOfEffect = areaOfEffect;
    this.originalAreaOfEffect = this.createCopy(this.areaOfEffect);
    this.areaOfEffectForm.controls['name'].setValue(areaOfEffect.name);
    this.areaOfEffectForm.controls['description'].setValue(areaOfEffect.description);
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
    if (this.areaOfEffectForm.valid) {
      this.loading = true;
      const values = this.areaOfEffectForm.value;
      this.areaOfEffect.name = values.name;
      this.areaOfEffect.description = values.description;
      if (this.areaOfEffect.id == null || this.areaOfEffect.id === '0') {
        this.areaOfEffectService.createAreaOfEffect(this.areaOfEffect).then((id: string) => {
          this.id = id;
          this.areaOfEffect.id = id;
          this.itemName = this.areaOfEffect.name;
          this.editing = false;
          this.cancelable = true;
          this.updateList(id);
          this.originalAreaOfEffect = this.createCopy(this.areaOfEffect);
          this.navigateToItem(id);
          this.loading = false;
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      } else {
        this.areaOfEffectService.updateAreaOfEffect(this.areaOfEffect).then(() => {
          this.itemName = this.areaOfEffect.name;
          this.editing = false;
          this.originalAreaOfEffect = this.createCopy(this.areaOfEffect);
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
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['areaOfEffects', id], 'side-nav': ['areaOfEffects', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else {
      this.areaOfEffect = this.createCopy(this.originalAreaOfEffect);
    }
  }

  createCopy(areaOfEffect: AreaOfEffect): AreaOfEffect {
    return _.cloneDeep(areaOfEffect);
  }

  delete(): void {
    this.loading = true;
    this.areaOfEffectService.deleteAreaOfEffect(this.areaOfEffect).then(() => {
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
    this.areaOfEffectService.duplicateAreaOfEffect(this.areaOfEffect, name).then((id: string) => {
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
    this.areaOfEffectService.updateMenuItems(id);
  }

  radiusChange(event: MatCheckboxChange): void {
    this.areaOfEffect.radius = event.checked;
  }

  widthChange(event: MatCheckboxChange): void {
    this.areaOfEffect.width = event.checked;
  }

  heightChange(event: MatCheckboxChange): void {
    this.areaOfEffect.height = event.checked;
  }

  lengthChange(event: MatCheckboxChange): void {
    this.areaOfEffect.length = event.checked;
  }

  shareClick(): void {
    this.loading = true;
    this.attributeService.getPublishDetails(this.areaOfEffect).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.attributeService.publishAttribute(this.areaOfEffect, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingAttributeService.addToMyStuff(this.areaOfEffect, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingAttributeService.continueAddToMyStuff(this.areaOfEffect).then((success: boolean) => {
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
