import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EventsService} from '../../../../core/services/events.service';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {Alignment} from '../../../../shared/models/attributes/alignment';
import {AlignmentService} from '../../../../core/services/attributes/alignment.service';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import * as _ from 'lodash';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingAttributeService} from '../../../../core/services/sharing/sharing-attribute.service';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {VersionInfo} from '../../../../shared/models/version-info';

@Component({
  selector: 'app-alignment-info',
  templateUrl: './alignment-info.component.html',
  styleUrls: ['./alignment-info.component.scss']
})
export class AlignmentInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public alignmentForm: FormGroup;
  id: string = null;
  alignment: Alignment;
  originalAlignment: Alignment;
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
    private sharingAttributeService: SharingAttributeService,
    private route: ActivatedRoute,
    private alignmentService: AlignmentService,
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
    this.alignment = new Alignment();
    this.originalAlignment = this.createCopy(this.alignment);
    this.alignmentForm = this.createForm();

    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateAlignment(new Alignment());
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.Alignments.New');
      this.updateAlignment(new Alignment());
      this.loading = false;
    } else {
      this.attributeService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.alignmentService.getAlignment(this.id).then((alignment: Alignment) => {
        if (alignment == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = alignment.name;
          this.updateAlignment(alignment);
        }
        this.loading = false;
      });
    }
  }

  updateAlignment(alignment: Alignment): void {
    this.alignment = alignment;
    this.originalAlignment = this.createCopy(this.alignment);
    this.alignmentForm.controls['name'].setValue(alignment.name);
    this.alignmentForm.controls['description'].setValue(alignment.description);
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
    if (this.alignmentForm.valid) {
      this.loading = true;
      const values = this.alignmentForm.value;
      this.alignment.name = values.name;
      this.alignment.description = values.description;
      if (this.alignment.id == null || this.alignment.id === '0') {
        this.alignmentService.createAlignment(this.alignment).then((id: string) => {
          this.id = id;
          this.alignment.id = id;
          this.itemName = this.alignment.name;
          this.editing = false;
          this.cancelable = true;
          this.updateList(id);
          this.originalAlignment = this.createCopy(this.alignment);
          this.navigateToItem(id);
          this.loading = false;
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      } else {
        this.alignmentService.updateAlignment(this.alignment).then(() => {
          this.itemName = this.alignment.name;
          this.originalAlignment = this.createCopy(this.alignment);
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
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['alignments', id], 'side-nav': ['alignments', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  delete(): void {
    this.loading = true;
    this.alignmentService.deleteAlignment(this.alignment).then(() => {
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
    this.alignmentService.duplicateAlignment(this.alignment, name).then((id: string) => {
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
    } else {
      this.alignment = this.createCopy(this.originalAlignment);
    }
  }

  createCopy(alignment: Alignment): Alignment {
    return _.cloneDeep(alignment);
  }

  private updateList(id: string): void {
    this.alignmentService.updateMenuItems(id);
  }

  shareClick(): void {
    this.loading = true;
    this.attributeService.getPublishDetails(this.alignment).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.attributeService.publishAttribute(this.alignment, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingAttributeService.addToMyStuff(this.alignment, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingAttributeService.continueAddToMyStuff(this.alignment).then((success: boolean) => {
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
