import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureAbilityProficiency} from '../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {PowerService} from '../../../../core/services/powers/power.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';
import {Proficiency} from '../../../../shared/models/proficiency';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';

@Component({
  selector: 'app-creature-ability-card',
  templateUrl: './creature-ability-card.component.html',
  styleUrls: ['./creature-ability-card.component.scss']
})
export class CreatureAbilityCardComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() ability: CreatureAbilityProficiency;
  @Input() disabled = false;
  @Output() abilityClick = new EventEmitter();

  score = '';
  tooltip = '';
  proficiency = new Proficiency();
  eventSub: Subscription;

  constructor(
    private abilityService: AbilityService,
    private powerService: PowerService,
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initialize();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === (EVENTS.AbilityScoreChange + this.ability.ability.id) ||
        event === EVENTS.ModifiersUpdated ||
        event === EVENTS.ConditionUpdated ||
        event === EVENTS.CarryingUpdated ||
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
    this.score = this.getTotalScore();
    this.tooltip = this.creatureService.getAbilityScoreTooltip(this.ability, this.collection);
    this.proficiency = new Proficiency();
    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      if (this.characterService.hasModifiedAbilityCheckDisadvantage(playerCharacter, this.collection, this.ability.ability.sid)) {
        this.proficiency.disadvantage = true;
        this.proficiency.disadvantageDisabled = true;
        this.proficiency.disadvantageTooltip = this.characterService.getModifiedAbilityCheckDisadvantageTooltip(playerCharacter, this.collection, this.ability.ability.sid);
      }
    } else {
      if (this.creatureService.hasModifiedAbilityCheckDisadvantage(this.creature, this.ability.ability.sid, null, this.collection)) {
        this.proficiency.disadvantage = true;
        this.proficiency.disadvantageDisabled = true;
        this.proficiency.disadvantageTooltip = this.creatureService.getModifiedAbilityCheckDisadvantageTooltip(this.creature, this.ability.ability.sid, null, this.collection);
      }
    }
  }

  onAbilityClick(): void {
    if (!this.disabled) {
      this.abilityClick.emit(this.ability);
    }
  }

  private getTotalScore(): string {
    const score = this.creatureService.getAbilityScore(this.ability, this.collection);
    return this.abilityService.getScoreAndModifier(score);
  }
}
