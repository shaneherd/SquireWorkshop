import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Feature} from '../../../../shared/models/powers/feature';
import {RangeType} from '../../../../shared/models/powers/range-type.enum';
import {ListObject} from '../../../../shared/models/list-object';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {CharacteristicType} from '../../../../shared/models/characteristics/characteristic-type.enum';
import {CharacterLevel} from '../../../../shared/models/character-level';
import {LimitedUse} from '../../../../shared/models/powers/limited-use';
import {CharacterLevelService} from '../../../../core/services/character-level.service';
import {LimitedUseType} from '../../../../shared/models/limited-use-type.enum';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {TranslateService} from '@ngx-translate/core';
import {DamageConfigurationCollection} from '../../../../shared/models/damage-configuration-collection';
import {ModifierConfigurationCollection} from '../../../../shared/models/modifier-configuration-collection';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Tag} from '../../../../shared/models/tag';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {CreatureFeature} from '../../../../shared/models/creatures/creature-feature';
import {FeatureListObject} from '../../../../shared/models/powers/feature-list-object';
import {PowerService} from '../../../../core/services/powers/power.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-feature-details',
  templateUrl: './feature-details.component.html',
  styleUrls: ['./feature-details.component.scss']
})
export class FeatureDetailsComponent implements OnInit, OnDestroy {
  @Input() creatureFeature: CreatureFeature;
  @Input() featureListObject: FeatureListObject;
  @Input() feature: Feature;
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() detailed = true;
  @Input() onDark = true;
  @Input() showHelp = true;
  @Input() showAll = true;
  @Output() damageChange = new EventEmitter();
  @Output() modifierChange = new EventEmitter();
  @Output() limitedUseChange = new EventEmitter();
  @Output() characterLevelChange = new EventEmitter();

  eventSub: Subscription;
  abilities: ListObject[] = [];
  levels: CharacterLevel[] = [];
  limitedUse: LimitedUse = null;
  maxUses = 0;
  usesRemaining = 0;
  damageConfigurationCollection: DamageConfigurationCollection = null;
  modifierConfigurationCollection: ModifierConfigurationCollection = null;
  characterLevel: CharacterLevel = null;
  active = false;
  editingTags = false;
  isFeat = false;

  constructor(
    private translate: TranslateService,
    private abilityService: AbilityService,
    private characterLevelService: CharacterLevelService,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private eventsService: EventsService,
    private powerService: PowerService
  ) { }

  ngOnInit() {
    this.initializeAbilities();
    this.initializeLevels();
    this.active = this.creatureFeature != null && this.creatureFeature.active;
    this.isFeat = this.feature.characteristicType === CharacteristicType.FEAT;

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange
        || event === EVENTS.ModifiersUpdated) {
        this.initializeLimitedUse();
        this.initializeDamages();
        this.initializeModifiers();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeAbilities(): void {
    this.abilities = [];
    this.abilityService.getAbilities().then().then((abilities: ListObject[]) => {
      this.abilities = abilities;
    });
  }

  private initializeLevels(): void {
    this.levels = [];
    this.characterLevelService.getLevelsDetailed().then((levels: CharacterLevel[]) => {
      this.levels = levels;

      if (this.detailed) {
        this.initializeCharacterLevel();
      }
      this.initializeLimitedUse();
      this.initializeDamages();
      this.initializeModifiers();
    });
  }

  private initializeCharacterLevel(): void {
    if (this.feature == null || this.playerCharacter == null || this.collection == null) {
      return;
    }

    this.characterLevel = this.characterService.getCreatureFeatureCharacterLevel(this.playerCharacter, this.creatureFeature, this.collection);
    this.characterLevelChange.emit(this.characterLevel);
  }

  private initializeLimitedUse(): void {
    if (this.feature == null || this.playerCharacter == null || this.collection == null || this.characterLevel == null) {
      return;
    }

    this.limitedUse = this.powerService.getPowerLimitedUse(this.feature, this.characterLevel, this.levels);
    if (this.limitedUse != null) {
      this.maxUses = this.powerService.getMaxUses(this.limitedUse, this.getAbilityModifier(this.limitedUse.abilityModifier));
      this.usesRemaining = this.creatureFeature == null ? 0 : this.creatureFeature.usesRemaining;
      this.limitedUseChange.emit(this.usesRemaining);
    }
  }

  private initializeDamages(): void {
    this.damageConfigurationCollection = this.characterService.getPowerDamages(this.feature, this.playerCharacter, this.characterLevel, this.collection, null, null);
    this.damageChange.emit(this.damageConfigurationCollection);
  }

  private initializeModifiers(): void {
    this.modifierConfigurationCollection = this.characterService.getPowerModifiers(this.feature, this.playerCharacter, this.characterLevel, this.collection);
    this.modifierChange.emit(this.modifierConfigurationCollection);
  }

  isOther(): boolean {
    return this.feature.rangeType === RangeType.OTHER;
  }

  getMaxUses(): string {
    let maxUses = this.maxUses + '';
    if (this.limitedUse != null && this.limitedUse.limitedUseType === LimitedUseType.DICE) {
      const label = this.translate.instant('DiceSize.' + this.limitedUse.diceSize);
      maxUses += 'd' + label;
    }
    return maxUses;
  }

  private getAbilityModifier(abilityId: string): number {
    const ability = this.creatureService.getAbility(abilityId, this.collection);
    if (ability != null) {
      return this.creatureService.getAbilityModifier(ability, this.collection);
    }
    return 0;
  }

  getUsesRemaining(): string {
    let remaining = this.usesRemaining + '';
    if (this.limitedUse != null && this.limitedUse.limitedUseType === LimitedUseType.DICE) {
      const label = this.translate.instant('DiceSize.' + this.limitedUse.diceSize);
      remaining += 'd' + label;
    }
    return remaining;
  }

  editTags(): void {
    this.editingTags = true;
  }

  closeTags(): void {
    this.editingTags = false;
  }

  saveTags(tags: Tag[]): void {
    if (this.featureListObject != null) {
      this.featureListObject.tags = tags;
    }
    this.eventsService.dispatchEvent(EVENTS.FeatureTagsUpdated);
    this.eventsService.dispatchEvent(EVENTS.FetchFeaturesList);
    this.editingTags = false;
  }

}
