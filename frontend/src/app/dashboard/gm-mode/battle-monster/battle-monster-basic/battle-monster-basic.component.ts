import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {BattleMonster} from '../../../../shared/models/creatures/battle-monsters/battle-monster';
import {Subscription} from 'rxjs';
import {CreatureListProficiency} from '../../../../shared/models/creatures/creature-list-proficiency';
import {SpeedType} from '../../../../shared/models/speed-type.enum';
import {ActivatedRoute} from '@angular/router';
import {ResolutionService} from '../../../../core/services/resolution.service';
import {EventsService} from '../../../../core/services/events.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {TranslateService} from '@ngx-translate/core';
import {EVENTS, SID} from '../../../../constants';
import {CreatureState} from '../../../../shared/models/creatures/creature-state.enum';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import {CombatCreature} from '../../../../shared/models/combat-row';
import {CampaignSettings} from '../../../../shared/models/campaigns/campaign-settings';

@Component({
  selector: 'app-battle-monster-basic',
  templateUrl: './battle-monster-basic.component.html',
  styleUrls: ['./battle-monster-basic.component.scss']
})
export class BattleMonsterBasicComponent implements OnInit, OnDestroy {
  @Input() combatCreature: CombatCreature;
  @Input() battleMonster: BattleMonster;
  @Input() campaignSettings: CampaignSettings;
  @Input() collection: CreatureConfigurationCollection;
  @Output() flee = new EventEmitter();
  @Output() delay = new EventEmitter();

  resSub: Subscription;
  eventSub: Subscription;

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
  speedTooltip = '';
  proficiencyBonusTooltip = '';
  carryingTooltip = '';
  isEncumbered = false;
  encumberedLimit = 0;
  isHeavilyEncumbered = false;
  heavilyEncumberedLimit = 0;
  carryingLimit = 0;

  clickDisabled = false;
  quickKill = false;

  constructor(
    private route: ActivatedRoute,
    private resolutionService: ResolutionService,
    private eventsService: EventsService,
    private creatureService: CreatureService,
    private monsterService: MonsterService,
    private abilityService: AbilityService,
    private translate: TranslateService
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
        case EVENTS.SpeedUpdated:
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
          this.initializeSpeed();
          break;
        case EVENTS.ExhaustionLevelChanged:
          this.initializeSpeed();
          this.initializeHP();
          break;
      }
    });
  }

  ngOnDestroy() {
    this.resSub.unsubscribe();
    this.eventSub.unsubscribe();
  }

  private initialize(): void {
    this.initializeAC();
    this.initializeHP();
    this.initializeInitiative();
    this.initializeSpeed();
    this.initializeProficiency();
    this.updateIsDead();
    this.quickKill = this.campaignSettings.health.killMonsters && this.combatCreature.isMonster();
  }

  private initializeAC(): void {
    this.ac = this.monsterService.getAC(this.battleMonster, this.collection);
    this.combatCreature.setAC(this.ac);
    this.acTooltip = this.monsterService.getACTooltip(this.battleMonster, this.collection);
  }

  private initializeHP(): void {
    this.currentHP = this.creatureService.getCurrentHP(this.battleMonster, this.collection);
    this.currentHPTooltip = this.creatureService.getCurrentHPTooltip(this.battleMonster);
    this.maxHP = this.monsterService.getMaxHP(this.battleMonster, this.collection);
    this.maxHPTooltip = this.monsterService.getMaxHPTooltip(this.battleMonster, this.collection);
    this.bloody = this.currentHP <= (this.maxHP / 2);
    if (this.currentHP === 0) {
      this.bloody = false;
    }
  }

  private initializeInitiative(): void {
    this.initiativeProficiency = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.INITIATIVE, this.collection);
    const modifier = this.creatureService.getInitiativeModifier(this.collection);
    this.initiative = this.abilityService.convertScoreToString(modifier);
    this.initiativeTooltip = this.creatureService.getInitiativeModifierTooltip(this.collection);
  }

  private initializeSpeed(): void {
    this.speedType = this.battleMonster.settings.speed.speedToDisplay;
    if (this.creatureService.isProne(this.battleMonster)) {
      this.speedType = SpeedType.CRAWL;
    }
    const speedConfig = this.monsterService.getSpeedConfiguration(this.battleMonster, this.collection, this.speedType, this.battleMonster.settings.speed);
    const speed = this.monsterService.getSpeed(speedConfig);
    this.speed = this.translate.instant('Headers.FeetValue', {'feet': speed});
    this.speedTooltip = this.monsterService.getSpeedTooltip(speedConfig);

    setTimeout(() => {
      this.combatCreature.setSpeed(speed);
      this.combatCreature.setSpeedType(this.speedType);
    });
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

  healthSaveClick(): void {
    this.viewingHP = false;
    this.updateClickDisabled();
    this.updateIsDead();
  }

  saveClick(): void {
    // this.initializeLevel();
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
    this.isDying = this.battleMonster.creatureHealth.creatureState === CreatureState.UNSTABLE || this.battleMonster.creatureHealth.creatureState === CreatureState.STABLE;
    this.isDead = this.battleMonster.creatureHealth.creatureState === CreatureState.DEAD;
  }

}
