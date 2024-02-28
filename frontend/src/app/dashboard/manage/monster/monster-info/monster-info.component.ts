import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ComponentCanDeactivate} from '../../../../core/guards/pending-changes.guard';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {ImportItem} from '../../../../shared/imports/import-item';
import {PublishDetails} from '../../../../shared/models/publish-details';
import {VersionInfo} from '../../../../shared/models/version-info';
import {SharingAttributeService} from '../../../../core/services/sharing/sharing-attribute.service';
import {EventsService} from '../../../../core/services/events.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {EVENTS, NAVIGATION_DELAY, SID, SKIP_LOCATION_CHANGE} from '../../../../constants';
import * as _ from 'lodash';
import {PublishRequest} from '../../../../shared/models/publish-request';
import {MatDialog} from '@angular/material/dialog';
import {Monster, MonsterAbilityScore} from '../../../../shared/models/creatures/monsters/monster';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import {DiceSize} from '../../../../shared/models/dice-size.enum';
import {ListObject} from '../../../../shared/models/list-object';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {MonsterConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {ChallengeRating} from '../../../../shared/models/creatures/monsters/challenge-rating.enum';
import {MonsterType} from '../../../../shared/models/creatures/monsters/monster-type.enum';
import {Size} from '../../../../shared/models/size.enum';
import {AlignmentService} from '../../../../core/services/attributes/alignment.service';
import {Alignment} from '../../../../shared/models/attributes/alignment';
import {SpeedType} from '../../../../shared/models/speed-type.enum';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {SharingMonsterService} from '../../../../core/services/sharing/sharing-monster.service';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportDialogService} from '../../../../core/services/export/export-dialog.service';
import {ExportMonsterService} from '../../../../core/services/export/export-monster.service';

@Component({
  selector: 'app-monster-info',
  templateUrl: './monster-info.component.html',
  styleUrls: ['./monster-info.component.scss']
})
export class MonsterInfoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  public monsterForm: FormGroup;
  id: string;
  monster: Monster;
  originalMonster: Monster;
  editing = false;
  itemName = '';
  cancelable = true;
  loading = false;
  routeSub: Subscription;
  queryParamsSub: Subscription;

  challengeRatings: ChallengeRating[] = [];
  monsterTypes: MonsterType[] = [];
  diceSizes: DiceSize[] = [];
  abilities: ListObject[] = [];
  sizes: Size[] = [];
  alignments: ListObject[] = [];
  selectedAlignment: Alignment;
  flySpeedType = SpeedType.FLY;

  importItem: ImportItem = null;
  viewShare = false;
  publishDetails: PublishDetails;
  versionInfo: VersionInfo;
  isPublic = false;
  isShared = false;
  listSource: ListSource = ListSource.MY_STUFF;

  monsterConfigurationCollection: MonsterConfigurationCollection = null;
  originalMonsterConfigurationCollection: MonsterConfigurationCollection = null;

  constructor(
    private sharingAttributeService: SharingAttributeService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    public monsterService: MonsterService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private abilityService: AbilityService,
    private alignmentService: AlignmentService,
    private sharingMonsterService: SharingMonsterService,
    private exportDialogService: ExportDialogService,
    private exportDetailsService: ExportMonsterService
  ) { }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.editing;
  }

  ngOnInit() {
    this.monster = this.getDefaultMonster();
    this.monsterConfigurationCollection = new MonsterConfigurationCollection();
    this.initializeDiceSizes();
    this.initializeAbilities();
    this.initializeChallengeRatings();
    this.initializeMonsterTypes();
    this.initializeSizes();
    this.initializeAlignments();

    this.originalMonster = this.createCopy(this.monster);
    this.monsterForm = this.createForm();
    this.routeSub = this.route.params.subscribe((params: { id: string }) => {
      this.loading = true;
      this.id = params.id;
      this.editing = this.id === '0';
      this.cancelable = this.id !== '0';
      this.initializeData();
    });
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
  }

  private getDefaultMonster(): Monster {
    const monster = new Monster();
    monster.hitDice.abilityModifier = this.abilityService.getAbilityBySid(SID.ABILITIES.CONSTITUTION);
    return monster;
  }

  private initializeData(): void {
    if (this.id === '0') {
      this.itemName = this.translate.instant('Navigation.Manage.Monsters.New');
      this.updateMonster(this.getDefaultMonster());
      this.loading = false;
    } else {
      this.monsterService.getVersionInfo(this.id).then((versionInfo: VersionInfo) => {
        this.versionInfo = versionInfo;
      });
      this.monsterService.getMonster(this.id).then((monster: Monster) => {
        if (monster == null) {
          const translatedMessage = this.translate.instant('Error.Load');
          this.notificationService.error(translatedMessage);
          this.loading = false;
        } else {
          this.itemName = monster.name;
          this.updateMonster(monster);
        }
      });
    }
  }

  private initializeDiceSizes(): void {
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

  private initializeAbilities(): Promise<any> {
    this.abilities = [];
    return this.abilityService.getAbilities().then().then((abilities: ListObject[]) => {
      abilities = abilities.slice(0);
      const noAbility = new ListObject('0', this.translate.instant('None'));
      abilities.unshift(noAbility);
      this.abilities = abilities;
    });
  }

  private initializeChallengeRatings(): void {
    this.challengeRatings = [];
    this.challengeRatings.push(ChallengeRating.ZERO);
    this.challengeRatings.push(ChallengeRating.EIGHTH);
    this.challengeRatings.push(ChallengeRating.QUARTER);
    this.challengeRatings.push(ChallengeRating.HALF);
    this.challengeRatings.push(ChallengeRating.ONE);
    this.challengeRatings.push(ChallengeRating.TWO);
    this.challengeRatings.push(ChallengeRating.THREE);
    this.challengeRatings.push(ChallengeRating.FOUR);
    this.challengeRatings.push(ChallengeRating.FIVE);
    this.challengeRatings.push(ChallengeRating.SIX);
    this.challengeRatings.push(ChallengeRating.SEVEN);
    this.challengeRatings.push(ChallengeRating.EIGHT);
    this.challengeRatings.push(ChallengeRating.NINE);
    this.challengeRatings.push(ChallengeRating.TEN);
    this.challengeRatings.push(ChallengeRating.ELEVEN);
    this.challengeRatings.push(ChallengeRating.TWELVE);
    this.challengeRatings.push(ChallengeRating.THIRTEEN);
    this.challengeRatings.push(ChallengeRating.FOURTEEN);
    this.challengeRatings.push(ChallengeRating.FIFTEEN);
    this.challengeRatings.push(ChallengeRating.SIXTEEN);
    this.challengeRatings.push(ChallengeRating.SEVENTEEN);
    this.challengeRatings.push(ChallengeRating.EIGHTEEN);
    this.challengeRatings.push(ChallengeRating.NINETEEN);
    this.challengeRatings.push(ChallengeRating.TWENTY);
    this.challengeRatings.push(ChallengeRating.TWENTY_ONE);
    this.challengeRatings.push(ChallengeRating.TWENTY_TWO);
    this.challengeRatings.push(ChallengeRating.TWENTY_THREE);
    this.challengeRatings.push(ChallengeRating.TWENTY_FOUR);
    this.challengeRatings.push(ChallengeRating.TWENTY_FIVE);
    this.challengeRatings.push(ChallengeRating.TWENTY_SIX);
    this.challengeRatings.push(ChallengeRating.TWENTY_SEVEN);
    this.challengeRatings.push(ChallengeRating.TWENTY_EIGHT);
    this.challengeRatings.push(ChallengeRating.TWENTY_NINE);
    this.challengeRatings.push(ChallengeRating.THIRTY);
  }

  private initializeMonsterTypes(): void {
    this.monsterTypes = [];
    this.monsterTypes.push(MonsterType.ABERRATION);
    this.monsterTypes.push(MonsterType.BEAST);
    this.monsterTypes.push(MonsterType.CELESTIAL);
    this.monsterTypes.push(MonsterType.CONSTRUCT);
    this.monsterTypes.push(MonsterType.DRAGON);
    this.monsterTypes.push(MonsterType.ELEMENTAL);
    this.monsterTypes.push(MonsterType.FEY);
    this.monsterTypes.push(MonsterType.FIEND);
    this.monsterTypes.push(MonsterType.GIANT);
    this.monsterTypes.push(MonsterType.HUMANOID);
    this.monsterTypes.push(MonsterType.MONSTROSITY);
    this.monsterTypes.push(MonsterType.OOZE);
    this.monsterTypes.push(MonsterType.PLANT);
    this.monsterTypes.push(MonsterType.UNDEAD);
  }

  initializeSizes(): void {
    this.sizes = [];
    this.sizes.push(Size.TINY);
    this.sizes.push(Size.SMALL);
    this.sizes.push(Size.MEDIUM);
    this.sizes.push(Size.LARGE);
    this.sizes.push(Size.HUGE);
    this.sizes.push(Size.GARGUANTUAN);
  }

  private initializeAlignments(): void {
    this.alignmentService.getAlignments().then((alignments: ListObject[]) => {
      alignments.unshift(new ListObject('0', this.translate.instant('Unaligned')));
      this.alignments = alignments;
      this.initializeSelectedAlignment();
    });
  }

  private initializeSelectedAlignment(): void {
    if (this.monster.alignment != null && this.alignments.length > 0) {
      for (let i = 0; i < this.alignments.length; i++) {
        const alignment = this.alignments[i];
        if (alignment.id === this.monster.alignment.id) {
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

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

  private initializeDefaultAbilityScores(): void {
    this.initializeAbilities().then(() => {
      this.monster.abilityScores = [];
      this.abilities.forEach((ability: ListObject) => {
        if (ability.id !== '0') {
          const abilityScore = new MonsterAbilityScore();
          abilityScore.ability.id = ability.id;
          abilityScore.ability.name = ability.name;
          this.monster.abilityScores.push(abilityScore);
        }
      });
    });
  }

  updateMonster(monster: Monster): void {
    this.monster = monster;
    this.originalMonster = this.createCopy(this.monster);
    this.monsterForm.controls['name'].setValue(monster.name);
    this.monsterForm.controls['description'].setValue(monster.description);

    if (this.monster.abilityScores.length === 0) {
      this.initializeDefaultAbilityScores();
    }
    this.initializeSelectedAlignment();

    this.monsterService.initializeConfigurationCollection(monster, this.listSource)
      .then((collection: MonsterConfigurationCollection) => {
        this.monsterConfigurationCollection = collection;
        this.originalMonsterConfigurationCollection = this.monsterService.createCopyOfCollection(collection);
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

  close(): void {
    setTimeout(() => {
      this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['default']}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
    }, NAVIGATION_DELAY);
  }

  save(): void {
    if (this.monsterForm.valid) {
      this.loading = true;
      const values = this.monsterForm.value;
      this.monster.name = values.name;
      this.monster.description = values.description;
      this.monster.alignment = this.selectedAlignment.id === '0' ? null : this.selectedAlignment;
      //todo - other values
      this.monsterService.setFromCollections(this.monster, this.monsterConfigurationCollection);

      if (this.monster.id == null || this.monster.id === '0') {
        this.monsterService.createMonster(this.monster).then((id: string) => {
          this.id = id;
          this.monster.id = id;
          this.cancelable = true;
          this.finishSaving();
        }, () => {
          this.errorSaving();
        });
      } else {
        this.monsterService.updateMonster(this.monster).then(() => {
          this.finishSaving();
        }, () => {
          this.errorSaving();
        });
      }
    } else {
      const translatedMessage = this.translate.instant('Error.AllFieldsRequired');
      this.notificationService.error(translatedMessage);
    }
  }

  private errorSaving(): void {
    const translatedMessage = this.translate.instant('Error.Save');
    this.notificationService.error(translatedMessage);
    this.loading = false;
  }

  private finishSaving(): void {
    this.itemName = this.monster.name;
    this.editing = false;

    this.originalMonsterConfigurationCollection =
      this.monsterService.createCopyOfCollection(this.monsterConfigurationCollection);
    this.originalMonster = this.createCopy(this.monster);

    this.updateList(this.id);
    this.navigateToItem(this.id);
    this.loading = false;
  }

  private navigateToItem(id: string): void {
    this.router.navigate(['/home/dashboard', {outlets: {'middle-nav': ['monsters', id], 'side-nav': ['monsters', id]}}], {skipLocationChange: SKIP_LOCATION_CHANGE});
  }

  cancel(): void {
    if (this.id === '0') {
      this.close();
    } else {
      this.monster = this.createCopy(this.originalMonster);
    }
  }

  createCopy(monster: Monster): Monster {
    return _.cloneDeep(monster);
  }

  delete(): void {
    this.loading = true;
    this.monsterService.deleteMonster(this.monster).then(() => {
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
    this.monsterService.duplicateMonster(this.monster, name).then((id: string) => {
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
    this.monsterService.updateMenuItems(id);
  }

  shareClick(): void {
    this.loading = true;
    this.monsterService.getPublishDetails(this.monster).then((publishDetails: PublishDetails) => {
      this.publishDetails = publishDetails;
      this.viewShare = true;
      this.loading = false;
    });
  }

  closeShare(): void {
    this.viewShare = false;
  }

  saveShare(request: PublishRequest): void {
    this.monsterService.publishCreature(this.monster, request).then(() => {
      this.viewShare = false;
      this.notificationService.success(this.translate.instant('Success'));
    }, () => {
      this.viewShare = false;
      this.notificationService.error(this.translate.instant('Error.Unknown'));
    });
  }

  myStuffClick(): void {
    this.sharingMonsterService.addToMyStuff(this.monster, this.versionInfo, () => {
      this.loading = true;
      this.eventsService.dispatchEvent(EVENTS.AddToMyStuff);

      this.sharingMonsterService.continueAddToMyStuff(this.monster).then((success: boolean) => {
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
    item.listObject = new ListObject(this.monster.id, this.monster.name, this.monster.sid, this.monster.author);
    item.menuItem = new MenuItem(this.monster.id, this.monster.name);
    const selectedItems = [item];
    this.exportDialogService.showExportDialog(selectedItems, true, this.exportDetailsService, 'Monsters', () => {}, this.monster);
  }

  challengeRatingChange(challengeRating: ChallengeRating): void {
    this.monster.experience = this.getDefaultExperience(challengeRating);
    this.eventsService.dispatchEvent(EVENTS.ChallengeRatingChanged);
  }

  private getDefaultExperience(challengeRating: ChallengeRating): number {
    switch (challengeRating) {
      case ChallengeRating.ZERO:
        return 10;
      case ChallengeRating.EIGHTH:
        return 25;
      case ChallengeRating.QUARTER:
        return 50;
      case ChallengeRating.HALF:
        return 100;
      case ChallengeRating.ONE:
        return 200;
      case ChallengeRating.TWO:
        return 450;
      case ChallengeRating.THREE:
        return 700;
      case ChallengeRating.FOUR:
        return 1100;
      case ChallengeRating.FIVE:
        return 1800;
      case ChallengeRating.SIX:
        return 2300;
      case ChallengeRating.SEVEN:
        return 2900;
      case ChallengeRating.EIGHT:
        return 3900;
      case ChallengeRating.NINE:
        return 5000;
      case ChallengeRating.TEN:
        return 5900;
      case ChallengeRating.ELEVEN:
        return 7200;
      case ChallengeRating.TWELVE:
        return 8400;
      case ChallengeRating.THIRTEEN:
        return 10000;
      case ChallengeRating.FOURTEEN:
        return 11500;
      case ChallengeRating.FIFTEEN:
        return 13000;
      case ChallengeRating.SIXTEEN:
        return 15000;
      case ChallengeRating.SEVENTEEN:
        return 18000;
      case ChallengeRating.EIGHTEEN:
        return 20000;
      case ChallengeRating.NINETEEN:
        return 22000;
      case ChallengeRating.TWENTY:
        return 25000;
      case ChallengeRating.TWENTY_ONE:
        return 33000;
      case ChallengeRating.TWENTY_TWO:
        return 41000;
      case ChallengeRating.TWENTY_THREE:
        return 50000;
      case ChallengeRating.TWENTY_FOUR:
        return 62000;
      case ChallengeRating.TWENTY_FIVE:
        return 75000;
      case ChallengeRating.TWENTY_SIX:
        return 90000;
      case ChallengeRating.TWENTY_SEVEN:
        return 105000;
      case ChallengeRating.TWENTY_EIGHT:
        return 120000;
      case ChallengeRating.TWENTY_NINE:
        return 135000;
      case ChallengeRating.THIRTY:
        return 155000;
    }
  }

  abilityScoreChange(input): void {
    this.eventsService.dispatchEvent(EVENTS.AbilityScoreChange);
  }

  acChange(input): void {
    this.monster.ac = parseInt(input.value, 10);
  }

  expChange(input): void {
    this.monster.experience = parseInt(input.value, 10);
  }

  legendaryChange(input): void {
    this.monster.legendaryPoints = parseInt(input.value, 10);
  }

  sizeChange(size: Size): void {
    this.monster.hitDice.diceSize = this.getDefaultHitDiceSize(size);
  }

  private getDefaultHitDiceSize(size: Size): DiceSize {
    switch (size) {
      case Size.TINY:
        return DiceSize.FOUR;
      case Size.SMALL:
        return DiceSize.SIX;
      case Size.MEDIUM:
        return DiceSize.EIGHT;
      case Size.LARGE:
        return DiceSize.TEN;
      case Size.HUGE:
        return DiceSize.TWELVE;
      case Size.GARGUANTUAN:
        return DiceSize.TWENTY;
    }
  }

  hoverChange(event: MatCheckboxChange): void {
    this.monster.hover = event.checked;
  }

  handleConfigListUpdated(): void {
    this.originalMonsterConfigurationCollection.spellConfigurationCollection = _.cloneDeep(this.monsterConfigurationCollection.spellConfigurationCollection);
  }
}
