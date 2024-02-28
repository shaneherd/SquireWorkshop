import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureAbilityProficiency} from '../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {Proficiency} from '../../../../shared/models/proficiency';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';

@Component({
  selector: 'app-creature-ability-save-card',
  templateUrl: './creature-ability-save-card.component.html',
  styleUrls: ['./creature-ability-save-card.component.scss']
})
export class CreatureAbilitySaveCardComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() ability: CreatureAbilityProficiency;
  @Input() disabled = false;
  @Output() saveClick = new EventEmitter();

  totalSave = '';
  tooltip = '';
  proficiency = new Proficiency();
  autoFail = false;
  eventSub: Subscription;

  constructor(
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private abilityService: AbilityService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initialize();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === (EVENTS.AbilityScoreChange + this.ability.ability.id) ||
        event === (EVENTS.AbilitySaveChange + this.ability.ability.id) ||
        event === (EVENTS.HpUpdated) ||
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
    this.totalSave = this.getTotalSave();
    this.tooltip = this.creatureService.getAbilitySaveTooltip(this.ability, this.creature, this.collection);

    this.proficiency = new Proficiency();
    this.proficiency.advantage = this.ability.saveProficiency.proficiency.advantage;
    this.proficiency.disadvantage = this.ability.saveProficiency.proficiency.disadvantage;

    if (this.creature.creatureType === CreatureType.CHARACTER) {
      const playerCharacter = this.creature as PlayerCharacter;
      this.autoFail = this.characterService.hasModifiedSaveAutoFail(playerCharacter, this.ability.ability.sid);

      if (this.characterService.hasModifiedSaveDisadvantage(playerCharacter, this.collection, this.ability.ability.sid)) {
        this.proficiency.disadvantage = true;
        this.proficiency.disadvantageDisabled = true;
        this.proficiency.disadvantageTooltip = this.characterService.getModifiedSaveDisadvantageTooltip(playerCharacter, this.collection, this.ability.ability.sid);
      }
    } else {
      this.autoFail = this.creatureService.hasModifiedSaveAutoFail(this.creature, this.ability.ability.sid);

      if (this.creatureService.hasModifiedSaveDisadvantage(this.creature, this.ability.ability.sid, this.collection)) {
        this.proficiency.disadvantage = true;
        this.proficiency.disadvantageDisabled = true;
        this.proficiency.disadvantageTooltip = this.creatureService.getModifiedSaveDisadvantageTooltip(this.creature, this.ability.ability.sid, this.collection);
      }
    }
  }

  private getTotalSave(): string {
    const save = this.creatureService.getAbilitySaveModifier(this.ability, this.creature, this.collection);
    return this.abilityService.convertScoreToString(save);
  }

  onSaveClick(): void {
    if (!this.disabled) {
      this.saveClick.emit(this.ability);
    }
  }

}
