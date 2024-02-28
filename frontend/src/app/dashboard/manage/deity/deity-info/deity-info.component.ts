import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {Deity} from '../../../../shared/models/attributes/deity';
import {DeityService} from '../../../../core/services/attributes/deity.service';
import * as _ from 'lodash';
import {DeityCategoryService} from '../../../../core/services/attributes/deity-category.service';
import {AlignmentService} from '../../../../core/services/attributes/alignment.service';
import {ListObject} from '../../../../shared/models/list-object';
import {Alignment} from '../../../../shared/models/attributes/alignment';
import {DeityCategory} from '../../../../shared/models/attributes/deity-category';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingAttributeService} from '../../../../core/services/sharing/sharing-attribute.service';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {VersionInfo} from '../../../../shared/models/version-info';
import {EventsService} from '../../../../core/services/events.service';

@Component({
  selector: 'app-deity-info',
  templateUrl: './deity-info.component.html',
  styleUrls: ['./deity-info.component.scss']
})
export class DeityInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public deityForm: FormGroup;
  id: string;
  deity: Deity;
  originalDeity: Deity;
  editing = false;
  cancelable = true;
  loading = false;
  itemName = '';

  alignments: ListObject[] = [];
  selectedAlignment: Alignment;
  deityCategories: ListObject[] = [];
  selectedDeityCategory: DeityCategory;
  routeSub: Subscription;
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;

  constructor(
    public attributeService: AttributeService,
    private sharingAttributeService: SharingAttributeService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private deityService: DeityService,
    private deityCategoryService: DeityCategoryService,
    private alignmentService: AlignmentService,
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
    this.deity = new Deity();
    this.originalDeity = this.createCopyOfDeity(this.deity);
    this.deityForm = this.createForm();
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
      this.itemName = this.translate.instant('Navigation.Manage.Deities.New');
      this.updateDeity(new Deity());
      this.initializeAlignments();
      this.initializeDeityCategories();
      this.loading = false;
    } else {
      this.attributeService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.deityService.getDeity(this.id).then((deity: Deity) => {
        if (deity == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = deity.name;
          this.updateDeity(deity);
          this.initializeAlignments();
          this.initializeDeityCategories();
        }
        this.loading = false;
      });
    }
  }

  private initializeAlignments(): void {
    this.alignmentService.getAlignments().then((alignments: ListObject[]) => {
      alignments.unshift(new ListObject('0', this.translate.instant('Unaligned')));
      this.alignments = alignments;
      this.initializeSelectedAlignment();
    });
  }

  private initializeSelectedAlignment(): void {
    if (this.deity.alignment != null) {
      for (let i = 0; i < this.alignments.length; i++) {
        const alignment = this.alignments[i];
        if (alignment.id === this.deity.alignment.id) {
          this.selectedAlignment = alignment as Alignment;
          return;
        }
      }
    }
    if (this.alignments.length > 0) {
      this.selectedAlignment = this.alignments[0] as Alignment;
    } else {
      this.selectedAlignment = new Alignment();
    }
  }

  private initializeDeityCategories(): void {
    this.deityCategoryService.getDeityCategories().then((deityCategories: ListObject[]) => {
      deityCategories.unshift(new ListObject('0', this.translate.instant('None')));
      this.deityCategories = deityCategories;
      this.initializeSelectedDeityCategory();
    });
  }

  private initializeSelectedDeityCategory(): void {
    if (this.deity.deityCategory != null) {
      for (let i = 0; i < this.deityCategories.length; i++) {
        const category = this.deityCategories[i];
        if (category.id === this.deity.deityCategory.id) {
          this.selectedDeityCategory = category as DeityCategory;
          return;
        }
      }
    }
    if (this.deityCategories.length > 0) {
      this.selectedDeityCategory = this.deityCategories[0] as DeityCategory;
    } else {
      this.selectedDeityCategory = new DeityCategory();
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  updateDeity(deity: Deity): void {
    this.deity = deity;
    this.originalDeity = this.createCopyOfDeity(this.deity);
    this.deityForm.controls['name'].setValue(deity.name);
    this.deityForm.controls['description'].setValue(deity.description);
    this.deityForm.controls['symbol'].setValue(deity.symbol);
    this.cd.detectChanges();
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])],
        description: [null],
        symbol: [null]
      }
    );
  }

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }, NAVIGATION_DELAY);
  }

  save(): void {
    if (this.deityForm.valid) {
      this.loading = true;
      const values = this.deityForm.value;
      this.deity.name = values.name;
      this.deity.description = values.description;
      this.deity.symbol = values.symbol;
      this.deity.deityCategory = this.selectedDeityCategory.id === '0' ? null : this.selectedDeityCategory;
      if (this.deity.deityCategory != null) {
        this.deity.deityCategory.type = 'DeityCategory';
      }
      this.deity.alignment = this.selectedAlignment.id === '0' ? null : this.selectedAlignment;
      if (this.deity.alignment != null) {
        this.deity.alignment.type = 'Alignment';
      }

      if (this.deity.id == null || this.deity.id === '0') {
        this.deityService.createDeity(this.deity).then((id: string) => {
          this.id = id;
          this.deity.id = id;
          this.finishSaving();
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      } else {
        this.deityService.updateDeity(this.deity).then(() => {
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
    this.originalDeity = this.createCopyOfDeity(this.deity);
    this.itemName = this.deity.name;
    this.editing = false;
    this.cancelable = true;
    this.updateList(this.id);
    this.navigateToItem(this.id);
    this.loading = false;
  }

  private navigateToItem(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['deities', id], 'side-nav': ['deities', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else {
      this.deity = this.createCopyOfDeity(this.originalDeity);
    }
  }

  delete(): void {
    this.loading = true;
    this.deityService.deleteDeity(this.deity).then(() => {
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
    this.deityService.duplicateDeity(this.deity, name).then((id: string) => {
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
    this.deityService.updateMenuItems(id);
  }

  createCopyOfDeity(deity: Deity): Deity {
    return _.cloneDeep(deity);
  }

  shareClick(): void {
    this.loading = true;
    this.attributeService.getPublishDetails(this.deity).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.attributeService.publishAttribute(this.deity, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingAttributeService.addToMyStuff(this.deity, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingAttributeService.continueAddToMyStuff(this.deity).then((success: boolean) => {
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
