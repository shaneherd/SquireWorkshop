import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {DeityCategory} from '../../../../shared/models/attributes/deity-category';
import {DeityCategoryService} from '../../../../core/services/attributes/deity-category.service';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import * as _ from 'lodash';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingAttributeService} from '../../../../core/services/sharing/sharing-attribute.service';
import {VersionInfo} from '../../../../shared/models/version-info';
import {PublishDetails} from '../../../../shared/models/publish-details';

@Component({
  selector: 'app-deity-category-info',
  templateUrl: './deity-category-info.component.html',
  styleUrls: ['./deity-category-info.component.scss']
})
export class DeityCategoryInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public deityCategoryForm: FormGroup;
  id: string;
  itemName = '';
  deityCategory: DeityCategory;
  originalDeityCategory: DeityCategory;
  editing = false;
  cancelable = true;
  loading = false;
  routeSub: Subscription;
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;

  constructor(
    public attributeService: AttributeService,
    private sharingAttributeService: SharingAttributeService,
    private route: ActivatedRoute,
    private deityCategoryService: DeityCategoryService,
    private eventsService: EventsService,
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
    this.deityCategory = new DeityCategory();
    this.originalDeityCategory = this.createCopy(this.deityCategory);
    this.deityCategoryForm = this.createForm();
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateDeityCategory(new DeityCategory());
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.DeityCategories.New');
      this.updateDeityCategory(new DeityCategory());
      this.loading = false;
    } else {
      this.attributeService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.deityCategoryService.getDeityCategory(this.id).then((deityCategory: DeityCategory) => {
        if (deityCategory == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = deityCategory.name;
          this.updateDeityCategory(deityCategory);
        }
        this.loading = false;
      });
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  updateDeityCategory(deityCategory: DeityCategory): void {
    this.deityCategory = deityCategory;
    this.originalDeityCategory = this.createCopy(this.deityCategory);
    this.deityCategoryForm.controls['name'].setValue(deityCategory.name);
    this.deityCategoryForm.controls['description'].setValue(deityCategory.description);
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
    if (this.deityCategoryForm.valid) {
      this.loading = true;
      const values = this.deityCategoryForm.value;
      this.deityCategory.name = values.name;
      this.deityCategory.description = values.description;
      if (this.deityCategory.id == null || this.deityCategory.id === '0') {
        this.deityCategoryService.createDeityCategory(this.deityCategory).then((id: string) => {
          this.id = id;
          this.deityCategory.id = id;
          this.itemName = this.deityCategory.name;
          this.editing = false;
          this.cancelable = true;
          this.originalDeityCategory = this.createCopy(this.deityCategory);
          this.updateList(id);
          this.navigateToItem(id);
          this.cd.detectChanges();
          this.loading = false;
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      } else {
        this.deityCategoryService.updateDeityCategory(this.deityCategory).then(() => {
          this.itemName = this.deityCategory.name;
          this.editing = false;
          this.originalDeityCategory = this.createCopy(this.deityCategory);
          this.updateList(this.id);
          this.cd.detectChanges();
          this.navigateToItem(this.id);
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
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['deityCategories', id], 'side-nav': ['deityCategories', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else {
      this.deityCategory = this.createCopy(this.originalDeityCategory);
    }
  }

  createCopy(deityCategory: DeityCategory): DeityCategory {
    return _.cloneDeep(deityCategory);
  }

  delete(): void {
    this.loading = true;
    this.deityCategoryService.deleteDeityCategory(this.deityCategory).then(() => {
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
    this.deityCategoryService.duplicateDeityCategory(this.deityCategory, name).then((id: string) => {
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
    this.deityCategoryService.updateMenuItems(id);
  }

  shareClick(): void {
    this.loading = true;
    this.attributeService.getPublishDetails(this.deityCategory).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.attributeService.publishAttribute(this.deityCategory, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingAttributeService.addToMyStuff(this.deityCategory, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingAttributeService.continueAddToMyStuff(this.deityCategory).then((success: boolean) => {
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
