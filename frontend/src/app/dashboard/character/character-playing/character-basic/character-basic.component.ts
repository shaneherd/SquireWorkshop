import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS, SID} from '../../../../constants';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {TranslateService} from '@ngx-translate/core';
import {SpeedType} from '../../../../shared/models/speed-type.enum';
import {CreatureListProficiency} from '../../../../shared/models/creatures/creature-list-proficiency';
import {CreatureState} from '../../../../shared/models/creatures/creature-state.enum';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Subscription} from 'rxjs';
import {CharacterLevelService} from '../../../../core/services/character-level.service';
import {ResolutionService} from '../../../../core/services/resolution.service';
import {ActivatedRoute} from '@angular/router';
import {CombatCreature} from '../../../../shared/models/combat-row';

@Component({
  selector: 'app-character-basic',
  templateUrl: './character-basic.component.html',
  styleUrls: ['./character-basic.component.scss']
})
export class CharacterBasicComponent implements OnInit, OnDestroy {
  @Input() combatCreature: CombatCreature = null;
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() fromEncounter = false;
  @Output() flee = new EventEmitter();
  @Output() delay = new EventEmitter();

  resSub: Subscription;
  eventSub: Subscription;
  queryParamsSub: Subscription;
  isPublic = false;
  isShared = false;

  singleColumn = false;
  viewingAC = false;
  viewingHP = false;
  viewingInitiative = false;
  viewingLevel = false;
  viewingSpeed = false;
  viewingProf = false;
  viewingCarrying = false;
  viewingShortRest = false;
  viewingLongRest = false;
  isDead = false;
  isDying = false;

  initiativeProficiency: CreatureListProficiency;

  ac = 0;
  currentHP = 0;
  maxHP = 0;
  bloody = false;
  initiative = '';
  level = '';
  expProgress = 0;
  speed = '';
  speedType: SpeedType = SpeedType.WALK;
  proficiencyBonus = '';
  carrying = '';
  weight = 0;
  atMax = false;

  acTooltip = '';
  currentHPTooltip = '';
  maxHPTooltip = '';
  initiativeTooltip = '';
  levelTooltip = '';
  speedTooltip = '';
  proficiencyBonusTooltip = '';
  carryingTooltip = '';
  isEncumbered = false;
  encumberedLimit = 0;
  isHeavilyEncumbered = false;
  heavilyEncumberedLimit = 0;
  carryingLimit = 0;

  clickDisabled = false;

  constructor(
    private route: ActivatedRoute,
    private resolutionService: ResolutionService,
    private eventsService: EventsService,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private abilityService: AbilityService,
    private translate: TranslateService,
    private characterLevelService: CharacterLevelService
  ) { }

  ngOnInit() {
    this.initialize();

    this.resSub = this.resolutionService.width.subscribe(width => {
      this.singleColumn = width < 375;
    });

    this.eventSub = this.eventsService.events.subscribe(event => {
      switch (event) {
        case EVENTS.ModifiersUpdated:
        case EVENTS.AbilityScoreChange:
          this.initialize();
          break;
        case EVENTS.InitiativeUpdated:
          this.initializeInitiative();
          break;
        case EVENTS.ProficiencyUpdated:
          this.initializeProficiency();
          this.initializeInitiative();
          break;
        case EVENTS.HpUpdated:
          this.initializeHP();
          this.updateIsDead();
          break;
        case EVENTS.LevelUpdated:
          this.initializeLevel();
          this.initializeProficiency();
          break;
        case EVENTS.SpeedUpdated:
          this.initializeSpeed();
          break;
        case EVENTS.CarryingUpdated:
        case EVENTS.SettingsUpdated:
        case EVENTS.EquipmentSettingsUpdated:
          this.initializeCarrying();
          this.initializeSpeed();
          break;
        case EVENTS.AcUpdated:
          this.initializeAC();
          break;
        case EVENTS.ConditionUpdated:
          this.initializeSpeed();
          break;
        case EVENTS.ItemsUpdated:
          this.initializeAC();
          this.initializeCarrying();
          this.initializeSpeed();
          break;
        case EVENTS.ExhaustionLevelChanged:
          this.initializeSpeed();
          this.initializeHP();
          break;
      }
    });

    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
      });
  }

  ngOnDestroy() {
    this.resSub.unsubscribe();
    this.eventSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

  private initialize(): void {
    this.initializeAC();
    this.initializeHP();
    this.initializeLevel();
    this.initializeInitiative();
    this.initializeSpeed();
    this.initializeCarrying();
    this.initializeProficiency();
    this.updateIsDead();
  }

  private initializeAC(): void {
    this.ac = this.characterService.getAC(this.playerCharacter, this.collection);
    this.acTooltip = this.characterService.getACTooltip(this.playerCharacter, this.collection);
    if (this.combatCreature != null) {
      this.combatCreature.setAC(this.ac);
    }
  }

  private initializeHP(): void {
    this.currentHP = this.creatureService.getCurrentHP(this.playerCharacter, this.collection);
    this.currentHPTooltip = this.creatureService.getCurrentHPTooltip(this.playerCharacter);
    this.maxHP = this.characterService.getMaxHP(this.playerCharacter, this.collection);
    this.maxHPTooltip = this.characterService.getMaxHPTooltip(this.playerCharacter, this.collection);
    this.bloody = this.currentHP <= (this.maxHP / 2);
    if (this.currentHP === 0) {
      this.bloody = false;
    }
  }

  private initializeLevel(): void {
    this.level = this.collection.totalLevel.name;
    this.levelTooltip = this.translate.instant('ExpValue', { 'value': this.playerCharacter.exp });

    const currentLevelValue = parseInt(this.level, 10);
    const nextLevel = this.characterLevelService.getLevelByName((currentLevelValue + 1).toString());

    if (nextLevel == null) {
      this.expProgress = 100;
    } else {
      const minExp = this.collection.totalLevel.minExp;
      this.expProgress = (this.playerCharacter.exp - minExp) / (nextLevel.minExp - minExp) * 100;
      if (this.expProgress > 100) {
        this.expProgress = 100;
      }
    }
  }

  private initializeInitiative(): void {
    this.initiativeProficiency = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.INITIATIVE, this.collection);
    const modifier = this.creatureService.getInitiativeModifier(this.collection);
    this.initiative = this.abilityService.convertScoreToString(modifier);
    this.initiativeTooltip = this.creatureService.getInitiativeModifierTooltip(this.collection);
  }

  private initializeSpeed(): void {
    this.speedType = this.characterService.getSpeedType(this.playerCharacter);
    if (this.creatureService.isProne(this.playerCharacter)) {
      this.speedType = SpeedType.CRAWL;
    }
    const speedConfig = this.characterService.getSpeedConfiguration(this.playerCharacter, this.collection, this.speedType, this.playerCharacter.characterSettings.speed);
    const speed = this.characterService.getSpeed(speedConfig);
    this.speed = this.translate.instant('Headers.FeetValue', {'feet': speed});
    this.speedTooltip = this.characterService.getSpeedTooltip(speedConfig);

    if (this.combatCreature != null) {
      setTimeout(() => {
        this.combatCreature.setSpeed(speed);
        this.combatCreature.setSpeedType(this.speedType);
      });
    }
  }

  private initializeCarrying(): void {
    this.weight = this.characterService.getCarrying(this.playerCharacter, this.collection);
    this.carrying = this.translate.instant('WeightValue', { 'value': this.weight });
    this.carryingTooltip = this.characterService.getCarryingTooltip(this.playerCharacter, this.collection);
    this.isEncumbered = this.characterService.isEncumbered(this.playerCharacter, this.collection);
    this.isHeavilyEncumbered = this.characterService.isHeavilyEncumbered(this.playerCharacter, this.collection);
    this.encumberedLimit = 0;
    this.heavilyEncumberedLimit = 0;
    this.carryingLimit = this.characterService.getCarryingCapacity(this.collection);
    this.atMax = false;

    if (this.playerCharacter.characterSettings.equipment.useEncumbrance) {
      this.encumberedLimit = this.characterService.getEncumberedLimit(this.playerCharacter, this.collection);
      this.heavilyEncumberedLimit = this.characterService.getHeavilyEncumberedLimit(this.playerCharacter, this.collection);
    } else {
      this.atMax = this.weight >= this.carryingLimit;
    }
  }

  private initializeProficiency(): void {
    const modifier = this.creatureService.getProfModifier(this.collection);
    this.proficiencyBonus = this.abilityService.convertScoreToString(modifier);
    this.proficiencyBonusTooltip = this.creatureService.getProfModifierTooltip(this.collection);
  }

  acClick(): void {
    if (!this.clickDisabled) {
      this.viewingAC = true;
      this.updateClickDisabled();
    }
  }

  hpClick(): void {
    if (!this.clickDisabled) {
      this.viewingHP = true;
      this.updateClickDisabled();
    }
  }

  initiativeClick(): void {
    if (!this.clickDisabled) {
      this.viewingInitiative = true;
      this.updateClickDisabled();
    }
  }

  levelClick(): void {
    if (!this.clickDisabled) {
      this.viewingLevel = true;
      this.updateClickDisabled();
    }
  }

  speedClick(): void {
    if (!this.clickDisabled) {
      this.viewingSpeed = true;
      this.updateClickDisabled();
    }
  }

  profClick(): void {
    if (!this.clickDisabled) {
      this.viewingProf = true;
      this.updateClickDisabled();
    }
  }

  delayTurnClick(): void {
    if (!this.clickDisabled) {
      this.delay.emit();
    }
  }

  fleeClick(): void {
    if (!this.clickDisabled) {
      this.flee.emit();
    }
  }

  carryingClick(): void {
    if (!this.clickDisabled) {
      this.viewingCarrying = true;
      this.updateClickDisabled();
    }
  }

  longRestClick(): void {
    if (!this.clickDisabled && !this.isDying && !this.isDead) {
      this.viewingLongRest = true;
      this.updateClickDisabled();
    }
  }

  shortRestClick(): void {
    if (!this.clickDisabled && !this.isDying && !this.isDead) {
      this.viewingShortRest = true;
      this.updateClickDisabled();
    }
  }

  inspirationClick(): void {
    const newInspiration = !this.playerCharacter.inspiration;
    this.characterService.updateInspiration(this.playerCharacter, newInspiration).then(() => {
      this.playerCharacter.inspiration = newInspiration;
    });
  }

  healthSaveClick(): void {
    this.viewingHP = false;
    this.updateClickDisabled();
    this.updateIsDead();
  }

  saveClick(): void {
    this.initializeLevel();
    this.closeClick();
  }

  closeClick(): void {
    this.viewingAC = false;
    this.viewingHP = false;
    this.viewingInitiative = false;
    this.viewingLevel = false;
    this.viewingSpeed = false;
    this.viewingProf = false;
    this.viewingCarrying = false;
    this.viewingShortRest = false;
    this.viewingLongRest = false;

    this.updateClickDisabled();
  }

  private updateClickDisabled(): void {
    this.clickDisabled = this.viewingAC ||
      this.viewingHP ||
      this.viewingInitiative ||
      this.viewingLevel ||
      this.viewingSpeed ||
      this.viewingProf ||
      this.viewingCarrying ||
      this.viewingShortRest ||
      this.viewingLongRest;
  }

  private updateIsDead(): void {
    this.isDying = this.playerCharacter.creatureHealth.creatureState === CreatureState.UNSTABLE || this.playerCharacter.creatureHealth.creatureState === CreatureState.STABLE;
    this.isDead = this.playerCharacter.creatureHealth.creatureState === CreatureState.DEAD;
  }
}
