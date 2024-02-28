import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CharacteristicConfigurationCollection} from '../../../../shared/models/characteristics/characteristic-configuration-collection';
import {ListObject} from '../../../../shared/models/list-object';
import {ActivatedRoute, Router} from '@angular/router';
import {ProficienciesService} from '../../../../core/services/proficiency.service';
import {CharacteristicService} from '../../../../core/services/characteristics/characteristic.service';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {MatDialog} from '@angular/material';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs';
import {EVENTS, NAVIGATION_DELAY, SID, SKIP_LOCATION_CHANGE} from '../../../../constants';
import {CharacterClass} from '../../../../shared/models/characteristics/character-class';
import {CharacterClassService} from '../../../../core/services/characteristics/character-class.service';
import * as _ from 'lodash';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {CasterTypeService} from '../../../../core/services/attributes/caster-type.service';
import {Ability} from '../../../../shared/models/attributes/ability.model';
import {CharacterLevelService} from '../../../../core/services/character-level.service';
import {AbilityScoreIncreaseCollection} from '../../../../shared/models/characteristics/ability-score-increase-collection';
import {CasterType} from '../../../../shared/models/attributes/caster-type';
import {HttpErrorResponse} from '@angular/common/http';
import {SubclassService} from '../../../../core/services/characteristics/subclass.service';
import {ImportItem} from '../../../../shared/imports/import-item';
import {ImportService} from '../../../../core/services/import/import.service';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {SharingCharacteristicService} from '../../../../core/services/sharing/sharing-characteristic.service';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {VersionInfo} from '../../../../shared/models/version-info';
import {EventsService} from '../../../../core/services/events.service';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {ItemFilterService} from '../../../../core/services/item-filter.service';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportDialogService} from '../../../../core/services/export/export-dialog.service';
import {ExportCharacteristicService} from '../../../../core/services/export/export-characteristic.service';

@Component({
  selector: 'app-class-info',
  templateUrl: './class-info.component.html',
  styleUrls: ['./class-info.component.scss']
})
export class ClassInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public classForm: FormGroup;
  id: string = null;
  characterClass: CharacterClass;
  originalCharacterClass: CharacterClass;
  editing = false;
  cancelable = true;
  loading = false;
  diceSizes: DiceSize[] = [];
  abilities: ListObject[] = [];
  casterTypes: ListObject[] = [];
  itemName = '';

  characteristicConfigurationCollection = new CharacteristicConfigurationCollection();
  originalCharacteristicConfigurationCollection = new CharacteristicConfigurationCollection();
  abilityScoreIncreaseCollection = new AbilityScoreIncreaseCollection();
  originalAbilityScoreIncreaseCollection = new AbilityScoreIncreaseCollection();

  classes: ListObject[] = [];
  numToPrepareAbility: ListObject = new ListObject('0', '');
  originalNumToPrepareAbility: ListObject;
  queryParamsSub: Subscription;
  paramSub: Subscription;
  isSubclass = false;
  parentId: string;
  parent: CharacterClass = null;

  importing = false;
  importItem: ImportItem = null;
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;
  isPublic = false;
  isShared = false;
  listSource: ListSource = ListSource.MY_STUFF;

  constructor(
    public characteristicService: CharacteristicService,
    private sharingCharacteristicService: SharingCharacteristicService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private abilityService: AbilityService,
    private casterTypeService: CasterTypeService,
    private characterLevelService: CharacterLevelService,
    private proficienciesService: ProficienciesService,
    private characterClassService: CharacterClassService,
    private subclassService: SubclassService,
    private spellService: SpellService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private importService: ImportService,
    private itemFilterService: ItemFilterService,
    private exportDialogService: ExportDialogService,
    private exportDetailsService: ExportCharacteristicService
  ) {
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.editing;
  }

  ngOnInit() {
    this.characterClass = new CharacterClass();
    this.initializeDiceSizes();
    this.initializeAbilities();
    this.initializeCasterTypes();
    this.originalCharacterClass = this.createCopyClass(this.characterClass);
    this.classForm = this.createForm();

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

    this.paramSub = this.route.params.subscribe((params: { id: string, childId: string }) => {
      this.loading = true;
      this.id = params.id;
      this.isSubclass = params.childId != null;
      if (this.isSubclass) {
        this.id = params.childId;
        this.parentId = params.id;
      }
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
  }

  private initializeData(): void {
    if (this.id != null) {
      if (this.isSubclass) {
        this.subclassService.getParent(this.parentId).then((parent: CharacterClass) => {
          this.parent = parent;
          this.continueInitialization();
        });
      } else {
        this.continueInitialization();
      }
    }
  }

  private continueInitialization(): void {
    this.itemFilterService.initializeFilterOptions(this.listSource);
    if (this.id === '0') {
      this.itemName = this.isSubclass ? this.translate.instant('Navigation.Manage.Subclasses.New') : this.translate.instant('Navigation.Manage.Classes.New');
      this.updateClass(this.getNewClass());
    } else {
      if (!this.isSubclass) {
        this.characteristicService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
          this.versionInfo = versionInfo;
        });
      }
      this.characterClassService.getClass(this.id).then((characterClass: CharacterClass) => {
        if (characterClass == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        } else {
          this.itemName = characterClass.name;
          this.updateClass(characterClass);
          if (!this.isSubclass) {
            this.subclassService.updateParentClass(characterClass);
          }
        }
      });
    }
  }

  private getNewClass(): CharacterClass {
    const characterClass = new CharacterClass();
    characterClass.parent = this.parent;
    characterClass.startingGold.miscModifier = 10;
    const constitution = this.abilityService.getAbilityBySid(SID.ABILITIES.CONSTITUTION);
    characterClass.hitDice.numDice = 1;
    characterClass.hpAtFirst.abilityModifier = constitution;
    characterClass.hpGain.numDice = 1;
    characterClass.hpGain.abilityModifier = constitution;
    return characterClass;
  }

  ngOnDestroy() {
    this.queryParamsSub.unsubscribe();
    this.paramSub.unsubscribe();
  }

  initializeDiceSizes(): void {
    this.diceSizes = [];
    this.diceSizes.push(DiceSize.ONE);
    this.diceSizes.push(DiceSize.TWO);
    this.diceSizes.push(DiceSize.THREE);
    this.diceSizes.push(DiceSize.FOUR);
    this.diceSizes.push(DiceSize.SIX);
    this.diceSizes.push(DiceSize.EIGHT);
    this.diceSizes.push(DiceSize.TEN);
    this.diceSizes.push(DiceSize.TWELVE);
    this.diceSizes.push(DiceSize.TWENTY);
    this.diceSizes.push(DiceSize.HUNDRED);
  }

  initializeAbilities(): void {
    this.abilities = [];
    this.abilityService.getAbilities().then().then((abilities: ListObject[]) => {
      abilities = abilities.slice(0);
      const noAbility = new ListObject('0', '');
      abilities.unshift(noAbility);
      this.abilities = abilities;
    });
  }

  startingGoldNumDiceChange(input): void {
    this.characterClass.startingGold.numDice = input.value;
  }

  startingGoldDiceSizeChange(value: DiceSize): void {
    this.characterClass.startingGold.diceSize = value;
  }

  startingGoldMiscModifierChange(input): void {
    this.characterClass.startingGold.miscModifier = input.value;
  }

  initializeCasterTypes(): void {
    this.casterTypes = [];
    this.casterTypeService.getCasterTypes().then().then((casterTypes: ListObject[]) => {
      casterTypes = casterTypes.slice(0);
      const noCasterType = new ListObject('0', '');
      casterTypes.unshift(noCasterType);
      this.casterTypes = casterTypes;
    });
  }

  getCasterType(id: string): ListObject {
    for (let i = 0; i < this.casterTypes.length; i++) {
      const casterType: ListObject = this.casterTypes[i];
      if (casterType.id === id) {
        return casterType;
      }
    }
    return null;
  }

  updateClass(characterClass: CharacterClass): void {
    this.loading = true;
    this.characterClass = characterClass;
    const parent: CharacterClass = this.characterClass.parent == null ? null : this.characterClass.parent as CharacterClass;
    this.originalCharacterClass = this.createCopyClass(this.characterClass);
    this.characteristicService.setAll(parent);
    this.characterClassService.setAllSecondaryProfs(parent);
    this.characterClassService.setAllAbilityScoreIncreases(parent);
    this.classForm.controls['name'].setValue(characterClass.name);
    this.classForm.controls['description'].setValue(characterClass.description);
    const ability: Ability = this.characterClass.classSpellPreparation.numToPrepareAbilityModifier;
    this.numToPrepareAbility = new ListObject(
      ability == null ? '0' : ability.id,
      ability == null ? '' : ability.name
    );
    this.originalNumToPrepareAbility = this.createCopyAbility(this.numToPrepareAbility);
    this.characteristicService.initializeConfigurationCollection(characterClass, false, this.listSource)
      .then((collection: CharacteristicConfigurationCollection) => {
        collection.spellConfigurationCollection.casterType =
          this.characterClass.casterType == null ? '0' : this.characterClass.casterType.id;
        this.characterClassService.initializeSecondaryProfs(characterClass, collection.proficiencyCollection);
        this.abilityScoreIncreaseCollection =
          this.characterClassService.initializeAbilityScoreIncreases(characterClass, collection.spellConfigurationCollection.levels);
        this.originalAbilityScoreIncreaseCollection =
          this.characterClassService.createCopyOfAbilityCollection(this.abilityScoreIncreaseCollection);
        this.characteristicConfigurationCollection = collection;
        this.originalCharacteristicConfigurationCollection = this.characteristicService.createCopyOfCollection(collection);
        this.loading = false;
      });
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

  close(delay: boolean = true): void {
    setTimeout(() => {
      const extras = {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': this.isPublic, 'shared': this.isShared}};
      if (this.isSubclass) {
        if (this.parent == null) {
          this.router.navigate(['/home/dashboard', {outlets: {
            'middle-nav': ['default'],
            'side-nav': ['classes'],
          }}], extras);
        } else {
          this.router.navigate(['/home/dashboard', {outlets: {
            'middle-nav': ['classes', this.parent.id],
            'side-nav': ['classes', this.parent.id]
          }}], extras);
        }
      } else {
        this.router.navigate(['/home/dashboard',
          {outlets: {'middle-nav': ['default']}}], extras);
      }
    }, delay ? NAVIGATION_DELAY : 0);
  }

  save(): void {
    if (this.classForm.valid) {
      this.loading = true;
      const values = this.classForm.value;
      this.characterClass.name = values.name;
      this.characterClass.description = values.description;
      if (this.numToPrepareAbility.id === '0') {
        this.characterClass.classSpellPreparation.numToPrepareAbilityModifier = null;
      } else {
        this.characterClass.classSpellPreparation.numToPrepareAbilityModifier = new Ability();
        this.characterClass.classSpellPreparation.numToPrepareAbilityModifier.id = this.numToPrepareAbility.id;
      }

      this.characteristicService.setFromCollections(this.characterClass, this.characteristicConfigurationCollection);
      this.characterClassService.setSecondaryProficiencies(
        this.characteristicConfigurationCollection.proficiencyCollection,
        this.characterClass
      );
      this.characterClassService.setAbilityScoreIncreases(this.abilityScoreIncreaseCollection, this.characterClass);
      this.setCasterType();

      if (this.characterClass.id == null || this.characterClass.id === '0' || this.importing) {
        this.characterClassService.createClass(this.characterClass).then((id: string) => {
          this.id = id;
          this.characterClass.id = id;
          this.cancelable = true;
          this.finishSaving();
        }, (error: HttpErrorResponse) => {
          this.errorSaving(error);
        });
      } else {
        this.characterClassService.updateClass(this.characterClass).then(() => {
          this.updateSubclassIds();
          this.finishSaving();
        }, (error: HttpErrorResponse) => {
          this.errorSaving(error);
        });
      }
    } else {
      const translatedMessage = this.translate.instant('Error.AllFieldsRequired');
      this.notificationService.error(translatedMessage);
    }
  }

  private updateSubclassIds(): void {
    if (this.hasNewSubclasses()) {
      this.characteristicService.getChildrenCharacteristics(this.characterClass.id).then((children: ListObject[]) => {
        if (children.length === this.characterClass.subclasses.length) {
          for (let i = 0; i < this.characterClass.subclasses.length; i++) {
            const subclass = this.characterClass.subclasses[i];
            const child = children[i];
            subclass.id = child.id;
          }
        }
      });
    }
  }

  private hasNewSubclasses(): boolean {
    for (let i = 0; i < this.characterClass.subclasses.length; i++) {
      if (this.characterClass.subclasses[i].id === '0') {
        return true;
      }
    }
    return false;
  }

  private setCasterType(): void {
    const selectedCasterType = this.characteristicConfigurationCollection.spellConfigurationCollection.casterType;
    if (selectedCasterType === '0') {
      this.characterClass.casterType = null;
    } else {
      const casterType = this.getCasterType(selectedCasterType);
      this.characterClass.casterType = new CasterType(null);
      this.characterClass.casterType.id = casterType.id;
      this.characterClass.casterType.name = casterType.name;
    }
  }

  private finishSaving(): void {
    this.itemName = this.characterClass.name;
    this.editing = false;

    this.originalCharacteristicConfigurationCollection =
      this.characteristicService.createCopyOfCollection(this.characteristicConfigurationCollection);
    this.originalAbilityScoreIncreaseCollection =
      this.characterClassService.createCopyOfAbilityCollection(this.abilityScoreIncreaseCollection);
    this.originalCharacterClass = this.createCopyClass(this.characterClass);
    this.originalNumToPrepareAbility = this.createCopyAbility(this.numToPrepareAbility);

    this.updateList(this.id);
    if (!this.importing) {
      this.navigateToItem(this.id);
    } else {
      this.importService.completeItem(this.importItem, this.id);
      this.navigateToImporting();
    }
    this.loading = false;
  }

  private navigateToItem(id: string): void {
    if (this.isSubclass) {
      this.router.navigate(['/home/dashboard', {outlets: {
        'middle-nav': ['classes', this.parent.id, id],
        'side-nav': ['classes', this.parent.id, id]
      }}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    } else {
      this.router.navigate(['/home/dashboard', {outlets: {
        'middle-nav': ['classes', id],
        'side-nav': ['classes', id]
      }}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }
  }

  private navigateToImporting(): void {
    this.router.navigate(['/home/dashboard',
        {outlets: {'middle-nav': ['import'], 'side-nav': ['default']}}],
      {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  private errorSaving(error: HttpErrorResponse): void {
    let translatedMessage = '';
    switch (error.status) {
      case 418:
        translatedMessage = this.translate.instant('Error.UnableToDeleteSubclasses')
        break;
      default:
        translatedMessage = this.translate.instant('Error.Save');
        break;
    }
    this.notificationService.error(translatedMessage);
    this.loading = false;
  }

  delete(): void {
    this.loading = true;
    this.characterClassService.deleteClass(this.characterClass).then(() => {
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
      this.close(false);
    } else {
      this.characteristicConfigurationCollection =
        this.characteristicService.createCopyOfCollection(this.originalCharacteristicConfigurationCollection);
      this.abilityScoreIncreaseCollection =
        this.characterClassService.createCopyOfAbilityCollection(this.originalAbilityScoreIncreaseCollection);
      this.characterClass = this.createCopyClass(this.originalCharacterClass);
      this.numToPrepareAbility = this.createCopyAbility(this.originalNumToPrepareAbility);
    }
  }

  createCopyClass(characterClass: CharacterClass): CharacterClass {
    return _.cloneDeep(characterClass);
  }

  createCopyAbility(ability: ListObject): ListObject {
    return _.cloneDeep(ability);
  }

  duplicate(name: string): void {
    this.loading = true;
    this.characterClassService.duplicateClass(this.characterClass, name).then((id: string) => {
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
    if (this.isSubclass) {
      this.subclassService.updateMenuItems(id);
    } else {
      this.characterClassService.updateMenuItems(id);
    }
  }

  subclassClick(subclass: CharacterClass): void {
    if (!this.editing) {
      const subclassId = subclass == null ? '0' : subclass.id;
      const extras = {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': this.isPublic, 'shared': this.isShared}};
      this.router.navigate(['/home/dashboard', {outlets: {
          'middle-nav': ['classes', this.characterClass.id, subclassId],
          'side-nav': ['classes', this.characterClass.id, subclassId]
        }}], extras);
    }
  }

  addSubclass(): void {
    this.subclassClick(null);
  }

  handleConfigListUpdated(): void {
    this.originalCharacteristicConfigurationCollection.spellConfigurationCollection = _.cloneDeep(this.characteristicConfigurationCollection.spellConfigurationCollection);
  }

  shareClick(): void {
    this.loading = true;
    this.characteristicService.getPublishDetails(this.characterClass).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.characteristicService.publishCharacteristic(this.characterClass, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingCharacteristicService.addToMyStuff(this.characterClass, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingCharacteristicService.continueAddToMyStuff(this.characterClass).then((success: boolean) => {
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
    item.listObject = new ListObject(this.characterClass.id, this.characterClass.name, this.characterClass.sid, this.characterClass.author);
    item.menuItem = new MenuItem(this.characterClass.id, this.characterClass.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, false, this.exportDetailsService, 'Classes', () => {}, this.characterClass);
  }
}
