import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Monster, MonsterAbilityScore} from '../../../../shared/models/creatures/monsters/monster';
import {MonsterConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {ListObject} from '../../../../shared/models/list-object';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {EventsService} from '../../../../core/services/events.service';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {EVENTS} from '../../../../constants';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CharacterLevelService} from '../../../../core/services/character-level.service';
import {ChallengeRating} from '../../../../shared/models/creatures/monsters/challenge-rating.enum';

@Component({
  selector: 'app-monster-innate-spell-info',
  templateUrl: './monster-innate-spell-info.component.html',
  styleUrls: ['./monster-innate-spell-info.component.scss']
})
export class MonsterInnateSpellInfoComponent implements OnInit, OnDestroy {
  @Input() monster: Monster;
  @Input() editing: boolean;
  @Input() loading: boolean;
  @Input() monsterConfigurationCollection: MonsterConfigurationCollection;
  @Input() abilities: ListObject[];
  @Input() isPublic = false;
  @Input() isShared = false;
  @Output() configListUpdated = new EventEmitter();

  eventSub: Subscription;

  none: string;
  other: string;
  levels: ListObject[] = [];
  spellcasterLevel: ListObject;

  spellcastingAbilityModifier = 0;
  profModifier = 0;

  spellAttackBase = 0;
  spellAttackTotal = 0;
  spellAttackTooltip = '';
  spellAttackTotalTooltip = '';

  spellSaveBase = 0;
  spellSaveTotal = 0;
  spellSaveTooltip = '';
  spellSaveTotalTooltip = '';

  constructor(
    private characterLevelService: CharacterLevelService,
    private translate: TranslateService,
    private eventsService: EventsService,
    private monsterService: MonsterService,
    private abilityService: AbilityService
  ) { }

  ngOnInit() {
    this.none = this.translate.instant('None');
    this.other = this.translate.instant('Other');
    this.initializeSpellcasterLevels();
    this.initializeProfModifier();
    this.initializeSpellcastingAbilityModifier();
    this.initializeSpellAttackAndSave();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ChallengeRatingChanged) {
        this.initializeSpellcasterLevel(true);
        this.initializeProfModifier();
        this.initializeSpellAttackAndSave();
      } else if (event === EVENTS.AbilityScoreChange) {
        this.initializeSpellcastingAbilityModifier();
        this.initializeSpellAttackAndSave();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeSpellcasterLevels(): void {
    this.levels = this.characterLevelService.getLevelsDetailedFromStorageAsListObject();
    this.initializeSpellcasterLevel(this.editing);
  }

  private initializeSpellcasterLevel(useChallengeRating: boolean): void {
    if (useChallengeRating) {
      const crLevel = this.getInnateCasterLevelId();
      for (let i = 0; i < this.levels.length; i++) {
        const level = this.levels[i];
        if (level.name === crLevel) {
          this.spellcasterLevel = level;
          this.spellcasterLevelChange(level);
          return;
        }
      }
    } else {
      if (this.monster.innateSpellcasterLevel != null) {
        for (let i = 0; i < this.levels.length; i++) {
          const level = this.levels[i];
          if (level.id === this.monster.innateSpellcasterLevel.id) {
            this.spellcasterLevel = level;
            this.spellcasterLevelChange(level);
            return;
          }
        }
      }
    }

    this.spellcasterLevel = this.levels[0];
    this.spellcasterLevelChange(this.levels[0]);
  }

  private getInnateCasterLevelId(): string {
    switch (this.monster.challengeRating) {
      case ChallengeRating.ZERO:
      case ChallengeRating.EIGHTH:
      case ChallengeRating.QUARTER:
      case ChallengeRating.HALF:
      case ChallengeRating.ONE:
        return '1';
      case ChallengeRating.TWO:
        return '2';
      case ChallengeRating.THREE:
        return '3';
      case ChallengeRating.FOUR:
        return '4';
      case ChallengeRating.FIVE:
        return '5';
      case ChallengeRating.SIX:
        return '6';
      case ChallengeRating.SEVEN:
        return '7';
      case ChallengeRating.EIGHT:
        return '8';
      case ChallengeRating.NINE:
        return '9';
      case ChallengeRating.TEN:
        return '10';
      case ChallengeRating.ELEVEN:
        return '11';
      case ChallengeRating.TWELVE:
        return '12';
      case ChallengeRating.THIRTEEN:
        return '13';
      case ChallengeRating.FOURTEEN:
        return '14';
      case ChallengeRating.FIFTEEN:
        return '15';
      case ChallengeRating.SIXTEEN:
        return '16';
      case ChallengeRating.SEVENTEEN:
        return '17';
      case ChallengeRating.EIGHTEEN:
        return '18';
      case ChallengeRating.NINETEEN:
        return '19';
      case ChallengeRating.TWENTY:
      case ChallengeRating.TWENTY_ONE:
      case ChallengeRating.TWENTY_TWO:
      case ChallengeRating.TWENTY_THREE:
      case ChallengeRating.TWENTY_FOUR:
      case ChallengeRating.TWENTY_FIVE:
      case ChallengeRating.TWENTY_SIX:
      case ChallengeRating.TWENTY_SEVEN:
      case ChallengeRating.TWENTY_EIGHT:
      case ChallengeRating.TWENTY_NINE:
      case ChallengeRating.THIRTY:
        return '20';
    }
    return '1';
  }

  spellcasterLevelChange(level: ListObject): void {
    this.monster.innateSpellcasterLevel = level;
  }

  spellcasterChange(event: MatCheckboxChange): void {
    this.monster.innateSpellcaster = event.checked;
  }

  spellcastingAbilityChange(value: string): void {
    this.monsterConfigurationCollection.spellConfigurationCollection.innateSpellcastingAbility = value;
    this.initializeSpellcastingAbilityModifier();
    this.initializeSpellAttackAndSave();
  }

  private initializeSpellcastingAbilityModifier(): void {
    const abilityScore = this.getAbilityScore();
    if (abilityScore != null) {
      this.spellcastingAbilityModifier = this.abilityService.getAbilityModifier(abilityScore.value);
    } else {
      this.spellcastingAbilityModifier = 0;
    }
  }

  private getAbilityScore(): MonsterAbilityScore {
    for (let i = 0; i < this.monster.abilityScores.length; i++) {
      const abilityScore = this.monster.abilityScores[i];
      if (abilityScore.ability.id === this.monsterConfigurationCollection.spellConfigurationCollection.innateSpellcastingAbility) {
        return abilityScore;
      }
    }
    return null;
  }

  getAbility(id: string): ListObject {
    for (let i = 0; i < this.abilities.length; i++) {
      const ability: ListObject = this.abilities[i];
      if (ability.id === id) {
        return ability;
      }
    }
    return null;
  }

  handleConfigListUpdated(): void {
    this.configListUpdated.emit();
  }

  private initializeProfModifier(): void {
    this.profModifier = this.monsterService.getProfBonus(this.monster.challengeRating);
  }

  private initializeSpellAttackAndSave(): void {
    this.spellAttackBase = this.spellcastingAbilityModifier + this.profModifier;
    this.spellAttackTooltip = this.getAttackTooltip(false);
    this.updateSpellAttackTotal();

    this.spellSaveBase = 8 + this.spellcastingAbilityModifier + this.profModifier;
    this.spellSaveTooltip = this.getSaveTooltip(false);
    this.updateSpellSaveTotal();
  }

  spellAttackMiscChange(input): void {
    this.monster.innateSpellAttackModifier = parseInt(input.value, 10);
    this.updateSpellAttackTotal();
  }

  private updateSpellAttackTotal(): void {
    this.spellAttackTotal = this.spellAttackBase + this.monster.innateSpellAttackModifier;
    this.spellAttackTotalTooltip = this.getAttackTooltip(true);
  }

  private getAttackTooltip(includeMisc: boolean): string {
    const parts = [];
    parts.push(this.translate.instant('Ability') + ': ' + this.spellcastingAbilityModifier);
    parts.push(this.translate.instant('Prof') + ': ' + this.profModifier);
    if (includeMisc && this.monster.innateSpellAttackModifier !== 0) {
      parts.push(this.translate.instant('Misc') + ': ' + this.monster.innateSpellAttackModifier);
    }
    return parts.join('\n');
  }

  spellSaveMiscChange(input): void {
    this.monster.innateSpellSaveModifier = parseInt(input.value, 10);
    this.updateSpellSaveTotal();
  }

  private updateSpellSaveTotal(): void {
    this.spellSaveTotal = this.spellSaveBase + this.monster.innateSpellSaveModifier;
    this.spellSaveTotalTooltip = this.getSaveTooltip(true);
  }

  private getSaveTooltip(includeMisc: boolean): string {
    const parts = [];
    parts.push(this.translate.instant('Base') + ': 8');
    parts.push(this.translate.instant('Ability') + ': ' + this.spellcastingAbilityModifier);
    parts.push(this.translate.instant('Prof') + ': ' + this.profModifier);
    if (includeMisc && this.monster.innateSpellSaveModifier !== 0) {
      parts.push(this.translate.instant('Misc') + ': ' + this.monster.innateSpellSaveModifier);
    }
    return parts.join('\n');
  }
}
