import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ResolutionService} from '../../../../core/services/resolution.service';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {Skill} from '../../../../shared/models/attributes/skill';
import {SkillService} from '../../../../core/services/attributes/skill.service';
import {Ability} from '../../../../shared/models/attributes/ability.model';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {ListObject} from '../../../../shared/models/list-object';
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
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportDialogService} from '../../../../core/services/export/export-dialog.service';
import {ExportAttributeService} from '../../../../core/services/export/export-attribute.service';

@Component({
  selector: 'app-skill-info',
  templateUrl: './skill-info.component.html',
  styleUrls: ['./skill-info.component.scss']
})
export class SkillInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public skillForm: FormGroup;
  id: string;
  skill: Skill;
  originalSkill: Skill;
  editing = false;
  itemName = '';
  cancelable = true;
  loading = false;
  abilities: ListObject[] = [];
  noAbility: string;
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
    private skillService: SkillService,
    private abilityService: AbilityService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private resolutionService: ResolutionService,
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
    this.skill = new Skill();
    this.originalSkill = this.createCopy(this.skill);
    this.skillForm = this.createForm();
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateSkill(new Skill());
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.Skills.New');
      this.updateSkill(new Skill());
      this.loading = false;
    } else {
      this.attributeService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.skillService.getSkill(this.id).then((skill: Skill) => {
        if (skill == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = skill.name;
          this.updateSkill(skill);
        }
        this.loading = false;
      });
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  updateSkill(skill: Skill): void {
    this.skill = skill;
    this.originalSkill = this.createCopy(this.skill);
    this.skillForm.controls['name'].setValue(skill.name);
    this.skillForm.controls['ability'].setValue(skill.ability == null ? '0' : skill.ability.id);
    this.skillForm.controls['description'].setValue(skill.description);
    this.cd.detectChanges();
  }

  createForm(): FormGroup {
    this.noAbility = this.translate.instant('None');
    this.abilities = [];
    this.abilityService.getAbilities().then().then((abilities: ListObject[]) => {
      abilities = abilities.slice(0);
      const noAbility = new ListObject('0', '');
      abilities.unshift(noAbility);
      this.abilities = abilities;
    });
    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])],
        ability: [null, Validators.compose([Validators.required])],
        description: [null]
      }
    );
  }

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }, NAVIGATION_DELAY);
  }

  getAbility(id: string): ListObject {
    for (let i = 0; i < this.abilities.length; i++) {
      const ability = this.abilities[i];
      if (ability.id === id) {
        return ability;
      }
    }
    return null;
  }

  save(): void {
    if (this.skillForm.valid) {
      this.loading = true;
      const values = this.skillForm.value;
      this.skill.name = values.name;
      const selectAbility = this.getAbility(values.ability);
      if (selectAbility.id === '0') {
        this.skill.ability = null;
      } else {
        this.skill.ability = new Ability();
        this.skill.ability.id = selectAbility.id;
        this.skill.ability.name = selectAbility.name;
      }
      this.skill.description = values.description;
      if (this.skill.id == null || this.skill.id === '0' || this.importing) {
        this.skillService.createSkill(this.skill).then((id: string) => {
          this.id = id;
          this.originalSkill = this.createCopy(this.skill);
          this.skill.id = id;
          this.itemName = this.skill.name;
          this.editing = false;
          this.cancelable = true;
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
        this.skillService.updateSkill(this.skill).then(() => {
          this.itemName = this.skill.name;
          this.originalSkill = this.createCopy(this.skill);
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
      this.skill = this.createCopy(this.originalSkill);
    }
  }

  createCopy(skill: Skill): Skill {
    return _.cloneDeep(skill);
  }

  private navigateToItem(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['skills', id], 'side-nav': ['skills', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private navigateToImporting(): void {
    this.router.navigate(['/home/dashboard',
        {outlets: {'middle-nav': ['import'], 'side-nav': ['default']}}],
      {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  delete(): void {
    this.loading = true;
    this.skillService.deleteSkill(this.skill).then(() => {
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
    this.skillService.duplicateSkill(this.skill, name).then((id: string) => {
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
    this.skillService.updateMenuItems(id);
  }

  shareClick(): void {
    this.loading = true;
    this.attributeService.getPublishDetails(this.skill).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.attributeService.publishAttribute(this.skill, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingAttributeService.addToMyStuff(this.skill, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingAttributeService.continueAddToMyStuff(this.skill).then((success: boolean) => {
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
    item.listObject = new ListObject(this.skill.id, this.skill.name, this.skill.sid, this.skill.author);
    item.menuItem = new MenuItem(this.skill.id, this.skill.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, true, this.exportDetailsService, 'Skills', () => {}, this.skill);
  }
}
