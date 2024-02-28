import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureSkillListProficiency} from '../../../../shared/models/creatures/creature-skill-list-proficiency';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {PowerService} from '../../../../core/services/powers/power.service';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Proficiency} from '../../../../shared/models/proficiency';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';

@Component({
  selector: 'app-creature-skill-card',
  templateUrl: './creature-skill-card.component.html',
  styleUrls: ['./creature-skill-card.component.scss']
})
export class CreatureSkillCardComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() skill: CreatureSkillListProficiency;
  @Input() disabled = false;
  @Input() displayPassive = false;
  @Output() skillClick = new EventEmitter();

  eventSub: Subscription;
  tooltip = '';
  skillModifier = 0;
  totalModifier = '';
  proficiency = new Proficiency();
  passive = 0
  passiveTooltip = '';

  constructor(
    private abilityService: AbilityService,
    private powerService: PowerService,
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initialize();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange ||
        event === (EVENTS.SkillScoreChange + this.skill.skill.id) ||
        event === EVENTS.ModifiersUpdated ||
        event === EVENTS.ConditionUpdated ||
        event === EVENTS.CarryingUpdated ||
        event === EVENTS.ProficiencyUpdated ||
        event === EVENTS.ItemsUpdated ||
        event === EVENTS.ExhaustionLevelChanged) {
        this.initialize();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initialize(): void {
    this.skillModifier = this.creatureService.getSkillAbilityModifier(this.skill, this.creature, this.collection);
    this.totalModifier = this.abilityService.convertScoreToString(this.skillModifier);
    this.tooltip = this.creatureService.getSkillTooltip(this.skill, this.creature, this.collection);

    this.proficiency.advantage = this.skill.proficiency.advantage;
    this.proficiency.disadvantage = this.skill.proficiency.disadvantage;
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      if (this.characterService.hasModifiedAbilityCheckDisadvantage(playerCharacter, this.collection, this.skill.abilityProficiency.ability.sid, this.skill.skill.sid)) {
        this.proficiency.disadvantage = true;
        this.proficiency.disadvantageDisabled = true;
        this.proficiency.disadvantageTooltip = this.characterService.getModifiedAbilityCheckDisadvantageTooltip(playerCharacter, this.collection, this.skill.abilityProficiency.ability.sid, this.skill.skill.sid);
      }
    } else {
      if (this.creatureService.hasModifiedAbilityCheckDisadvantage(this.creature, this.skill.abilityProficiency.ability.sid, this.skill.skill.sid, this.collection)) {
        this.proficiency.disadvantage = true;
        this.proficiency.disadvantageDisabled = true;
        this.proficiency.disadvantageTooltip = this.creatureService.getModifiedAbilityCheckDisadvantageTooltip(this.creature, this.skill.abilityProficiency.ability.sid, this.skill.skill.sid, this.collection);
      }
    }

    this.initializePassive();
  }

  private initializePassive(): void {
    this.passive = this.creatureService.getSkillPassiveAbilityModifier(this.skill, this.creature, this.collection, this.proficiency.advantage, this.proficiency.disadvantage);
    this.passiveTooltip = this.creatureService.getSkillPassiveTooltip(this.skill, this.creature, this.collection, this.proficiency.advantage, this.proficiency.disadvantage);
  }

  onSkillClick(): void {
    if (!this.disabled) {
      this.skillClick.emit(this.skill);
    }
  }
}
