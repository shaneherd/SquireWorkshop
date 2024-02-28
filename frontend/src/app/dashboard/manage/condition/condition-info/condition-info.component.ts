import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {Condition} from '../../../../shared/models/attributes/condition';
import {ConditionService} from '../../../../core/services/attributes/condition.service';
import {ConnectingConditionCollection} from '../../../../shared/models/connecting-condition-collection';
import * as _ from 'lodash';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {ImportItem} from '../../../../shared/imports/import-item';
import {ImportService} from '../../../../core/services/import/import.service';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingAttributeService} from '../../../../core/services/sharing/sharing-attribute.service';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {VersionInfo} from '../../../../shared/models/version-info';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {EventsService} from '../../../../core/services/events.service';
import {ExportDialogService} from '../../../../core/services/export/export-dialog.service';
import {ExportAttributeService} from '../../../../core/services/export/export-attribute.service';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {ListObject} from '../../../../shared/models/list-object';
import {MenuItem} from '../../../../shared/models/menuItem.model';

@Component({
  selector: 'app-condition-info',
  templateUrl: './condition-info.component.html',
  styleUrls: ['./condition-info.component.scss']
})
export class ConditionInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public conditionForm: FormGroup;
  id: string;
  itemName = '';
  condition: Condition;
  originalCondition: Condition;
  isPublic = false;
  isShared = false;
  listSource: ListSource = ListSource.MY_STUFF;
  queryParamsSub: Subscription;

  editing = false;
  cancelable = true;
  loading = false;
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;

  connectingConditionCollection = new ConnectingConditionCollection();
  originalConnectingConditionCollection = new ConnectingConditionCollection();
  routeSub: Subscription;

  importing = false;
  importItem: ImportItem = null;

  constructor(
    public attributeService: AttributeService,
    private sharingAttributeService: SharingAttributeService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private conditionService: ConditionService,
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
    this.condition = new Condition();
    this.conditionForm = this.createForm();
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

    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.Conditions.New');
      this.updateCondition(new Condition());
      this.loading = false;
    } else {
      this.attributeService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.conditionService.getCondition(this.id).then((condition: Condition) => {
        if (condition == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = condition.name;
          this.updateCondition(condition);
        }
        this.loading = false;
      });
    }
  }

  ngOnDestroy() {
    this.queryParamsSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  updateCondition(condition: Condition): void {
    this.condition = condition;
    this.originalCondition = this.createCopyCondition(this.condition);
    this.conditionForm.controls['name'].setValue(condition.name);
    this.conditionForm.controls['description'].setValue(condition.description);
    this.conditionService.initializeConnectingConditionConfigurations(this.condition, this.listSource).then((collection: ConnectingConditionCollection) => {
      this.connectingConditionCollection = collection;
      this.originalConnectingConditionCollection = this.conditionService.createCopyOfCollection(this.connectingConditionCollection);
    });
    this.cd.detectChanges();
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])],
        description: [null, Validators.compose([Validators.required])]
      }
    );
  }

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }, NAVIGATION_DELAY);
  }

  save(): void {
    if (this.conditionForm.valid) {
      this.loading = true;
      const values = this.conditionForm.value;
      this.condition.name = values.name;
      this.condition.description = values.description;
      this.conditionService.setConnectingConditions(this.connectingConditionCollection, this.condition);
      if (this.condition.id == null || this.condition.id === '0' || this.importing) {
        this.conditionService.createCondition(this.condition).then((id: string) => {
          this.id = id;
          this.condition.id = id;
          this.finishSaving();
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      } else {
        this.conditionService.updateCondition(this.condition).then(() => {
          this.finishSaving();
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

  private finishSaving(): void {
    this.itemName = this.condition.name;
    this.editing = false;
    this.cancelable = true;
    this.updateList(this.id);
    if (!this.importing) {
      this.navigateToItem(this.id);
    } else {
      this.importService.completeItem(this.importItem, this.id);
      this.navigateToImporting();
    }
    this.loading = false;
    this.originalCondition = this.createCopyCondition(this.condition);
    this.originalConnectingConditionCollection = this.conditionService.createCopyOfCollection(this.connectingConditionCollection);
  }

  private navigateToItem(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['conditions', id], 'side-nav': ['conditions', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private navigateToImporting(): void {
    this.router.navigate(['/home/dashboard',
        {outlets: {'middle-nav': ['import'], 'side-nav': ['default']}}],
      {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  delete(): void {
    this.loading = true;
    this.conditionService.deleteCondition(this.condition).then(() => {
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
    this.conditionService.duplicateCondition(this.condition, name).then((id: string) => {
      this.loading = false;
      this.updateList(id);
      this.navigateToItem(id);
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Duplicate');
      this.notificationService.error(translatedMessage);
    });
  }

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else if (this.importing) {
      this.navigateToImporting();
    } else {
      this.connectingConditionCollection = this.conditionService.createCopyOfCollection(this.originalConnectingConditionCollection);
      this.condition = this.createCopyCondition(this.originalCondition);
    }
  }

  private createCopyCondition(condition: Condition): Condition {
    return _.cloneDeep(condition);
  }

  private updateList(id: string): void {
    this.conditionService.updateMenuItems(id, this.listSource);
  }

  shareClick(): void {
    this.loading = true;
    this.attributeService.getPublishDetails(this.condition).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.attributeService.publishAttribute(this.condition, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingAttributeService.addToMyStuff(this.condition, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingAttributeService.continueAddToMyStuff(this.condition).then((success: boolean) => {
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
    item.listObject = new ListObject(this.condition.id, this.condition.name, this.condition.sid, this.condition.author);
    item.menuItem = new MenuItem(this.condition.id, this.condition.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, true, this.exportDetailsService, 'Conditions', () => {}, this.condition);
  }
}
