import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ListObject} from '../../../../shared/models/list-object';
import {Monster, MonsterAbilityScore} from '../../../../shared/models/creatures/monsters/monster';
import {MonsterConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {TranslateService} from '@ngx-translate/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {CasterTypeService} from '../../../../core/services/attributes/caster-type.service';
import {CasterType} from '../../../../shared/models/attributes/caster-type';
import {CharacterLevelService} from '../../../../core/services/character-level.service';
import {SpellSlots} from '../../../../shared/models/spell-slots';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import {AbilityService} from '../../../../core/services/attributes/ability.service';

@Component({
  selector: 'app-monster-spell-info',
  templateUrl: './monster-spell-info.component.html',
  styleUrls: ['./monster-spell-info.component.scss']
})
export class MonsterSpellInfoComponent implements OnInit, OnDestroy {
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
  casterTypes: ListObject[] = [];
  selectedCasterType: CasterType = null;
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
    private casterTypeService: CasterTypeService,
    private translate: TranslateService,
    private eventsService: EventsService,
    private monsterService: MonsterService,
    private abilityService: AbilityService
  ) { }

  ngOnInit() {
    this.spellcasterLevel = this.monster.spellcasterLevel;
    this.none = this.translate.instant('None');
    this.other = this.translate.instant('Other');
    this.initializeSpellcasterLevels();
    this.initializeCasterTypes();
    this.initializeProfModifier();
    this.initializeSpellcastingAbilityModifier();
    this.initializeSpellAttackAndSave();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ChallengeRatingChanged) {
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
    this.initializeSpellcasterLevel();
  }

  private initializeSpellcasterLevel(): void {
    if (this.monster.spellcasterLevel != null) {
      for (let i = 0; i < this.levels.length; i++) {
        const level = this.levels[i];
        if (level.id === this.monster.spellcasterLevel.id) {
          this.spellcasterLevel = level;
          this.spellcasterLevelChange(level);
          return;
        }
      }
    }

    this.spellcasterLevel = this.levels[0];
    this.spellcasterLevelChange(this.levels[0]);
  }

  private initializeCasterTypes(): void {
    this.casterTypes = [];
    this.casterTypeService.getCasterTypes().then().then((casterTypes: ListObject[]) => {
      casterTypes = casterTypes.slice(0);
      casterTypes.unshift(new ListObject('0', this.other));
      this.casterTypes = casterTypes;

      this.initializeSelectedCasterType();
    });
  }

  private initializeSelectedCasterType(): void {
    for (let i = 0; i < this.casterTypes.length; i++) {
      const casterType = this.casterTypes[i];
      if (casterType.id === this.monsterConfigurationCollection.spellConfigurationCollection.casterType) {
        this.casterTypeChange(casterType.id);
        return;
      }
    }

    this.casterTypeChange(this.casterTypes[0].id);
  }

  spellcasterChange(event: MatCheckboxChange): void {
    this.monster.spellcaster = event.checked;
  }

  spellcasterLevelChange(level: ListObject): void {
    this.monster.spellcasterLevel = level;
    this.updateSpellSlots();
  }

  spellcastingAbilityChange(value: string): void {
    this.monsterConfigurationCollection.spellConfigurationCollection.spellcastingAbility = value;
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
      if (abilityScore.ability.id === this.monsterConfigurationCollection.spellConfigurationCollection.spellcastingAbility) {
        return abilityScore;
      }
    }
    return null;
  }

  casterTypeChange(value: string): void {
    this.monsterConfigurationCollection.spellConfigurationCollection.casterType = value;
    this.setCasterType();

    if (value === '0') {
      this.selectedCasterType = null;
      this.updateSpellSlots();
    } else {
      this.casterTypeService.getCasterType(value).then((casterType: CasterType) => {
        this.selectedCasterType = casterType;
        this.updateSpellSlots();
      });
    }
  }

  private setCasterType(): void {
    const selectedCasterType = this.monsterConfigurationCollection.spellConfigurationCollection.casterType;
    if (selectedCasterType === '0') {
      this.monster.casterType = null;
    } else {
      const casterType = this.getCasterType(selectedCasterType);
      this.monster.casterType = new ListObject();
      this.monster.casterType.id = casterType.id;
      this.monster.casterType.name = casterType.name;
    }
  }

  private updateSpellSlots(): void {
    if (this.selectedCasterType != null && this.selectedCasterType.id !== '0' && this.spellcasterLevel != null) {
      this.monster.spellSlots = this.getSpellSlotsForLevel(this.selectedCasterType.spellSlots, this.spellcasterLevel);
    }
  }

  private getSpellSlotsForLevel(spellSlots: SpellSlots[], level: ListObject): SpellSlots {
    for (let i = 0; i < spellSlots.length; i++) {
      const slot = spellSlots[i];
      if (slot.characterLevel.id === level.id) {
        return slot;
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

  getCasterType(id: string): ListObject {
    for (let i = 0; i < this.casterTypes.length; i++) {
      const casterType: ListObject = this.casterTypes[i];
      if (casterType.id === id) {
        return casterType;
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
    this.monster.spellAttackModifier = parseInt(input.value, 10);
    this.updateSpellAttackTotal();
  }

  private updateSpellAttackTotal(): void {
    this.spellAttackTotal = this.spellAttackBase + this.monster.spellAttackModifier;
    this.spellAttackTotalTooltip = this.getAttackTooltip(true);
  }

  private getAttackTooltip(includeMisc: boolean): string {
    const parts = [];
    parts.push(this.translate.instant('Ability') + ': ' + this.spellcastingAbilityModifier);
    parts.push(this.translate.instant('Prof') + ': ' + this.profModifier);
    if (includeMisc && this.monster.spellAttackModifier !== 0) {
      parts.push(this.translate.instant('Misc') + ': ' + this.monster.spellAttackModifier);
    }
    return parts.join('\n');
  }

  spellSaveMiscChange(input): void {
    this.monster.spellSaveModifier = parseInt(input.value, 10);
    this.updateSpellSaveTotal();
  }

  private updateSpellSaveTotal(): void {
    this.spellSaveTotal = this.spellSaveBase + this.monster.spellSaveModifier;
    this.spellSaveTotalTooltip = this.getSaveTooltip(true);
  }

  private getSaveTooltip(includeMisc: boolean): string {
    const parts = [];
    parts.push(this.translate.instant('Base') + ': 8');
    parts.push(this.translate.instant('Ability') + ': ' + this.spellcastingAbilityModifier);
    parts.push(this.translate.instant('Prof') + ': ' + this.profModifier);
    if (includeMisc && this.monster.spellSaveModifier !== 0) {
      parts.push(this.translate.instant('Misc') + ': ' + this.monster.spellSaveModifier);
    }
    return parts.join('\n');
  }
}
