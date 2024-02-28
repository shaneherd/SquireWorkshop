import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {ToolCategory} from '../../../../shared/models/attributes/tool-category';
import {ToolCategoryService} from '../../../../core/services/attributes/tool-category.service';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import * as _ from 'lodash';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingAttributeService} from '../../../../core/services/sharing/sharing-attribute.service';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {VersionInfo} from '../../../../shared/models/version-info';
import {EventsService} from '../../../../core/services/events.service';

@Component({
  selector: 'app-tool-category-info',
  templateUrl: './tool-category-info.component.html',
  styleUrls: ['./tool-category-info.component.scss']
})
export class ToolCategoryInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public toolCategoryForm: FormGroup;
  id: string;
  toolCategory: ToolCategory;
  originalToolCategory: ToolCategory;
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
    private toolCategoryService: ToolCategoryService,
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
    this.toolCategory = new ToolCategory();
    this.originalToolCategory = this.createCopy(this.toolCategory);
    this.toolCategoryForm = this.createForm();
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateToolCategory(new ToolCategory());
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.ToolCategories.New');
      this.updateToolCategory(new ToolCategory());
      this.loading = false;
    } else {
      this.attributeService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.toolCategoryService.getToolCategory(this.id).then((toolCategory: ToolCategory) => {
        if (toolCategory == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = toolCategory.name;
          this.updateToolCategory(toolCategory);
        }
        this.loading = false;
      });
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  updateToolCategory(toolCategory: ToolCategory): void {
    this.toolCategory = toolCategory;
    this.originalToolCategory = this.createCopy(this.toolCategory);
    this.toolCategoryForm.controls['name'].setValue(toolCategory.name);
    this.toolCategoryForm.controls['description'].setValue(toolCategory.description);
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
    if (this.toolCategoryForm.valid) {
      this.loading = true;
      const values = this.toolCategoryForm.value;
      this.toolCategory.name = values.name;
      this.toolCategory.description = values.description;
      if (this.toolCategory.id == null || this.toolCategory.id === '0') {
        this.toolCategoryService.createToolCategory(this.toolCategory).then((id: string) => {
          this.id = id;
          this.toolCategory.id = id;
          this.itemName = this.toolCategory.name;
          this.originalToolCategory = this.createCopy(this.toolCategory);
          this.editing = false;
          this.cancelable = true;
          this.updateList(id);
          this.navigateToItem(id);
          this.loading = false;
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      } else {
        this.toolCategoryService.updateToolCategory(this.toolCategory).then(() => {
          this.itemName = this.toolCategory.name;
          this.originalToolCategory = this.createCopy(this.toolCategory);
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
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['toolCategories', id], 'side-nav': ['toolCategories', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else {
      this.toolCategory = this.createCopy(this.originalToolCategory);
    }
  }

  createCopy(toolCategory: ToolCategory): ToolCategory {
    return _.cloneDeep(toolCategory);
  }

  delete(): void {
    this.loading = true;
    this.toolCategoryService.deleteToolCategory(this.toolCategory).then(() => {
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
    this.toolCategoryService.duplicateToolCategory(this.toolCategory, name).then((id: string) => {
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
    this.toolCategoryService.updateMenuItems(id);
  }

  shareClick(): void {
    this.loading = true;
    this.attributeService.getPublishDetails(this.toolCategory).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.attributeService.publishAttribute(this.toolCategory, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingAttributeService.addToMyStuff(this.toolCategory, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingAttributeService.continueAddToMyStuff(this.toolCategory).then((success: boolean) => {
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
