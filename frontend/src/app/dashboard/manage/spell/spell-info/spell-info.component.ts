import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {Observable, Subscription} from 'rxjs';
import {Spell} from '../../../../shared/models/powers/spell';
import * as _ from 'lodash';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EVENTS, NAVIGATION_DELAY, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {ListObject} from '../../../../shared/models/list-object';
import {CastingTimeUnit} from '../../../../shared/models/casting-time-unit.enum';
import {SpellSchoolService} from '../../../../core/services/attributes/spell-school.service';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {PowerService} from '../../../../core/services/powers/power.service';
import {RangeType} from '../../../../shared/models/powers/range-type.enum';
import {RangeUnit} from '../../../../shared/models/powers/range-unit.enum';
import {ModifierConfigurationCollection} from '../../../../shared/models/modifier-configuration-collection';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ImportItem} from '../../../../shared/imports/import-item';
import {ImportService} from '../../../../core/services/import/import.service';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingPowerService} from '../../../../core/services/sharing/sharing-power.service';
import {VersionInfo} from '../../../../shared/models/version-info';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {EventsService} from '../../../../core/services/events.service';
import {ExportDialogService} from '../../../../core/services/export/export-dialog.service';
import {ExportPowerService} from '../../../../core/services/export/export-power.service';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {MenuItem} from '../../../../shared/models/menuItem.model';

@Component({
  selector: 'app-spell-info',
  templateUrl: './spell-info.component.html',
  styleUrls: ['./spell-info.component.scss']
})
export class SpellInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public spellForm: FormGroup;
  id: string;
  spell: Spell;
  originalSpell: Spell;
  editing = false;
  itemName = '';
  cancelable = true;
  loading = false;
  none = '';
  cantrip = '';

  //levels
  levels: ListObject[] = [];
  selectedLevel = new ListObject('0', '');

  //range
  rangeTypes: RangeType[] = [];
  rangeUnits: RangeUnit[] = [];

  //schools
  schools: ListObject[] = [];
  selectedSchool = new ListObject('0', '');

  //casting time units
  castingTimeUnits: CastingTimeUnit[] = [];
  selectedCastingTimeUnit: CastingTimeUnit = CastingTimeUnit.ACTION;

  //damages
  damageConfigurationCollection: DamageConfigurationCollection = new DamageConfigurationCollection();
  originalDamageConfigurationCollection: DamageConfigurationCollection = new DamageConfigurationCollection();

  //modifiers
  modifierConfigurationCollection: ModifierConfigurationCollection = new ModifierConfigurationCollection();
  originalModifierConfigurationCollection: ModifierConfigurationCollection = new ModifierConfigurationCollection();

  configuring = false;
  routeSub: Subscription;

  importing = false;
  importItem: ImportItem = null;
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;

  constructor(
    public powerService: PowerService,
    private sharingPowerService: SharingPowerService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private spellService: SpellService,
    private spellSchoolService: SpellSchoolService,
    private abilityService: AbilityService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private importService: ImportService,
    private exportDialogService: ExportDialogService,
    private exportDetailsService: ExportPowerService
  ) { }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.editing;
  }

  createCopyOfSpell(spell: Spell): Spell {
    return _.cloneDeep(spell);
  }

  ngOnInit() {
    this.cantrip = this.translate.instant('Cantrip');
    this.spell = new Spell();
    this.initializeLevels();
    this.initializeSchools();
    this.initializeCastTimeUnits();
    this.initializeRangeTypes();
    this.initializeRangeUnits();
    this.originalSpell = this.createCopyOfSpell(this.spell);
    this.spellForm = this.createForm();
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.updateSpell(new Spell());
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.Spells.New');
      this.updateSpell(new Spell());
      this.loading = false;
    } else {
      this.powerService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.spellService.getSpell(this.id).then((spell: Spell) => {
        if (spell == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
        } else {
          this.itemName = spell.name;
          this.updateSpell(spell);
        }
        this.loading = false;
      });
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  updateSpell(spell: Spell): void {
    this.spell = spell;
    this.originalSpell = this.createCopyOfSpell(this.spell);
    this.spellForm.controls['name'].setValue(spell.name);
    this.spellForm.controls['range'].setValue(spell.range);
    this.spellForm.controls['castingTime'].setValue(spell.castingTime);
    this.spellForm.controls['components'].setValue(spell.components);
    this.spellForm.controls['duration'].setValue(spell.duration);
    this.spellForm.controls['description'].setValue(spell.description);
    this.spellForm.controls['higherLevels'].setValue(spell.higherLevels);
    this.initializeSelectedLevel();
    this.initializedSelectedCastingTimeUnit();
    this.initializeSelectedSchool();
    this.damageConfigurationCollection = this.powerService.initializeDamageConfigurations(spell);
    this.originalDamageConfigurationCollection =
      this.powerService.createCopyOfDamageConfigurationCollection(this.damageConfigurationCollection);

    this.modifierConfigurationCollection = this.powerService.initializeModifierConfigurations(spell);
    this.originalModifierConfigurationCollection =
      this.powerService.createCopyOfModifierConfigurationCollection(this.modifierConfigurationCollection);
    this.cd.detectChanges();
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        name: [null, Validators.compose([Validators.required])],
        range: [null],
        castingTime: [null],
        components: [null],
        duration: [null],
        description: [null],
        higherLevels: [null]
      }
    );
  }

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }, NAVIGATION_DELAY);
  }

  save(): void {
    if (this.spellForm.valid) {
      this.loading = true;
      const values = this.spellForm.value;
      this.spell.name = values.name;
      this.spell.range = values.range;
      this.spell.castingTime = values.castingTime;
      this.spell.components = values.components;
      this.spell.duration = values.duration;
      this.spell.description = values.description;
      this.spell.higherLevels = values.higherLevels;
      this.powerService.setDamageConfigurations(this.spell, this.damageConfigurationCollection);
      this.powerService.setModifierConfigurations(this.spell, this.modifierConfigurationCollection);
      if (this.spell.id == null || this.spell.id === '0' || this.importing) {
        this.spellService.createSpell(this.spell).then((id: string) => {
          this.id = id;
          this.spell.id = id;
          this.cancelable = true;
          this.finishSaving();
        }, () => {
          const translatedMessage = this.translate.instant('Error.Save');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        });
      } else {
        this.spellService.updateSpell(this.spell).then(() => {
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
    this.itemName = this.spell.name;
    this.editing = false;
    this.updateList(this.id);
    if (!this.importing) {
      this.navigateToItem(this.id);
    } else {
      this.importService.completeItem(this.importItem, this.id);
      this.navigateToImporting();
    }
    this.loading = false;
    this.originalSpell = this.createCopyOfSpell(this.spell);
    this.originalDamageConfigurationCollection =
      this.powerService.createCopyOfDamageConfigurationCollection(this.damageConfigurationCollection);
    this.originalModifierConfigurationCollection =
      this.powerService.createCopyOfModifierConfigurationCollection(this.modifierConfigurationCollection);
  }

  private navigateToItem(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['spells', id], 'side-nav': ['spells', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private navigateToImporting(): void {
    this.router.navigate(['/home/dashboard',
        {outlets: {'middle-nav': ['import'], 'side-nav': ['default']}}],
      {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  delete(): void {
    this.loading = true;
    this.spellService.deleteSpell(this.spell).then(() => {
      this.loading = false;
      this.updateList(null);
      this.close();
    }, () => {
      this.loading = false;
      const translatedMessage = this.translate.instant('Error.Delete');
      this.notificationService.error(translatedMessage);
    });
  }

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else if (this.importing) {
      this.navigateToImporting();
    } else {
      this.loading = true;
      this.spell = this.createCopyOfSpell(this.originalSpell);
      this.damageConfigurationCollection =
        this.powerService.createCopyOfDamageConfigurationCollection(this.originalDamageConfigurationCollection);
      this.modifierConfigurationCollection =
        this.powerService.createCopyOfModifierConfigurationCollection(this.originalModifierConfigurationCollection);
      this.initializeSelectedLevel();
      this.initializeSelectedSchool();
      this.initializedSelectedCastingTimeUnit();
      this.loading = false;
    }
  }

  duplicate(name: string): void {
    this.loading = true;
    this.spellService.duplicateSpell(this.spell, name).then((id: string) => {
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
    this.spellService.updateMenuItems(id);
  }

  configuringChange(configuring: boolean): void {
    this.configuring = configuring;
  }

  /************************************ Level **********************************/

  private initializeLevels(): void {
    this.none = this.translate.instant('None');
    this.levels.push(new ListObject('0', this.cantrip));
    this.levels.push(new ListObject('1', '1'));
    this.levels.push(new ListObject('2', '2'));
    this.levels.push(new ListObject('3', '3'));
    this.levels.push(new ListObject('4', '4'));
    this.levels.push(new ListObject('5', '5'));
    this.levels.push(new ListObject('6', '6'));
    this.levels.push(new ListObject('7', '7'));
    this.levels.push(new ListObject('8', '8'));
    this.levels.push(new ListObject('9', '9'));
  }

  levelChange(value: ListObject): void {
    this.selectedLevel = value;
    this.spell.level = parseInt(value.id, 10);
  }

  private initializeSelectedLevel(): void {
    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      if (level.id === this.spell.level.toString()) {
        this.selectedLevel = level;
        return;
      }
    }
    this.defaultSelectedLevel();
  }

  private defaultSelectedLevel(): void {
    if (this.levels.length > 0) {
      this.selectedLevel = this.levels[0];
    } else {
      this.selectedLevel = new ListObject('0', '');
    }
    this.spell.level = parseInt(this.selectedLevel.id, 10);
  }

  /************************************ Range **********************************/

  initializeRangeTypes(): void {
    this.rangeTypes = [];
    this.rangeTypes.push(RangeType.SELF);
    this.rangeTypes.push(RangeType.TOUCH);
    this.rangeTypes.push(RangeType.SIGHT);
    this.rangeTypes.push(RangeType.UNLIMITED);
    this.rangeTypes.push(RangeType.OTHER);
  }

  initializeRangeUnits(): void {
    this.rangeUnits = [];
    this.rangeUnits.push(RangeUnit.FEET);
    this.rangeUnits.push(RangeUnit.MILE);
  }

  isOther(): boolean {
    return this.spell.rangeType === RangeType.OTHER;
  }

  rangeTypeChange(value: RangeType): void {
    this.spell.rangeType = value;
  }

  rangeUnitChange(value: RangeUnit): void {
    this.spell.rangeUnit = value;
  }

  /************************************ Schools **********************************/

  private initializeSchools(): void {
    this.spellSchoolService.getSpellSchools().then((schools: ListObject[]) => {
      this.schools = schools;
      this.initializeSelectedSchool();
    });
  }

  schoolChange(value: ListObject): void {
    this.selectedSchool = value;
    this.setSpellSchool(value);
  }

  private setSpellSchool(school: ListObject): void {
    this.spell.spellSchool.id = school.id;
    this.spell.spellSchool.name = school.name;
    this.spell.spellSchool.description = school.description;
  }

  private initializeSelectedSchool(): void {
    for (let i = 0; i < this.schools.length; i++) {
      const school = this.schools[i];
      if (school.id === this.spell.spellSchool.id) {
        this.selectedSchool = school;
        this.setSpellSchool(this.selectedSchool);
        return;
      }
    }

    //defaults
    if (this.schools.length > 0) {
      this.selectedSchool = this.schools[0];
    } else {
      this.selectedSchool = new ListObject('0', '');
    }
    this.setSpellSchool(this.selectedSchool);
  }

  /************************************ Casting Time **********************************/

  private initializeCastTimeUnits(): void {
    this.castingTimeUnits = [];
    this.castingTimeUnits.push(CastingTimeUnit.ACTION);
    this.castingTimeUnits.push(CastingTimeUnit.BONUS_ACTION);
    this.castingTimeUnits.push(CastingTimeUnit.REACTION);
    this.castingTimeUnits.push(CastingTimeUnit.SECOND);
    this.castingTimeUnits.push(CastingTimeUnit.MINUTE);
    this.castingTimeUnits.push(CastingTimeUnit.HOUR);
  }

  castingTimeUnitChange(value: CastingTimeUnit): void {
    this.selectedCastingTimeUnit = value;
    this.spell.castingTimeUnit = value;
  }

  private initializedSelectedCastingTimeUnit(): void {
    for (let i = 0; i < this.castingTimeUnits.length; i++) {
      const castingTimeUnit = this.castingTimeUnits[i];
      if (castingTimeUnit === this.spell.castingTimeUnit) {
        this.selectedCastingTimeUnit = castingTimeUnit;
        return;
      }
    }

    //defaults
    if (this.castingTimeUnits.length > 0) {
      this.selectedCastingTimeUnit = this.castingTimeUnits[0];
    } else {
      this.selectedCastingTimeUnit = CastingTimeUnit.ACTION;
    }
    this.spell.castingTimeUnit = this.selectedCastingTimeUnit;
  }

  /************************************ Misc Helpers **********************************/

  ritualChange(event: MatCheckboxChange): void {
    this.spell.ritual = event.checked;
  }

  getComponents(): string {
    const values: string[] = [];
    if (this.spell.verbal) {
      values.push('V');
    }
    if (this.spell.somatic) {
      values.push('S');
    }
    if (this.spell.material) {
      values.push('M');
    }
    return values.join(', ');
  }

  verbalChange(event: MatCheckboxChange): void {
    this.spell.verbal = event.checked;
  }

  somaticChange(event: MatCheckboxChange): void {
    this.spell.somatic = event.checked;
  }

  materialChange(event: MatCheckboxChange): void {
    this.spell.material = event.checked;
  }

  getDuration(): string {
    const values: string[] = [];
    if (this.spell.instantaneous) {
      values.push(this.translate.instant('Instantaneous'));
    }
    if (this.spell.concentration) {
      values.push(this.translate.instant('Concentration'));
    }
    if (this.spell.duration.length > 0) {
      values.push(this.spell.duration);
    }
    return values.join(', ');
  }

  instantaneousChange(event: MatCheckboxChange): void {
    this.spell.instantaneous = event.checked;
  }

  concentrationChange(event: MatCheckboxChange): void {
    this.spell.concentration = event.checked;
  }

  shareClick(): void {
    this.loading = true;
    this.powerService.getPublishDetails(this.spell).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.powerService.publishPower(this.spell, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }


  myStuffClick(): void {
    this.sharingPowerService.addToMyStuff(this.spell, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingPowerService.continueAddToMyStuff(this.spell).then((success: boolean) => {
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
    item.listObject = new ListObject(this.spell.id, this.spell.name, this.spell.sid, this.spell.author);
    item.menuItem = new MenuItem(this.spell.id, this.spell.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, false, this.exportDetailsService, 'Spells', () => {}, this.spell);
  }
}
