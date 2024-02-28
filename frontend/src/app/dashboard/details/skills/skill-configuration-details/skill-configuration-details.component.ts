import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureSkillListProficiency} from '../../../../shared/models/creatures/creature-skill-list-proficiency';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Proficiency} from '../../../../shared/models/proficiency';
import {ModifierService} from '../../../../core/services/modifier.service';
import {EVENTS} from '../../../../constants';
import {DiceService} from '../../../../core/services/dice.service';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {LabelValue} from '../../../../shared/models/label-value';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-skill-configuration-details',
  templateUrl: './skill-configuration-details.component.html',
  styleUrls: ['./skill-configuration-details.component.scss']
})
export class SkillConfigurationDetailsComponent implements OnInit, OnDestroy {
  @Input() skill: CreatureSkillListProficiency;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  skillAbilityModifier = 0;
  misc = 0;
  proficiency: Proficiency = new Proficiency();
  modifiersDisplay: LabelValue[] = [];
  modifiers = 0;
  profModifier = 0;
  resurrectionPenalty = 0;
  total = 0;
  eventSub: Subscription;

  constructor(
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private modifierService: ModifierService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeMisc();
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange ||
        event === (EVENTS.SkillScoreChange + this.skill.skill.id) ||
        event === EVENTS.ModifiersUpdated ||
        event === EVENTS.ConditionUpdated ||
        event === EVENTS.CarryingUpdated ||
        event === EVENTS.ProficiencyUpdated ||
        event === EVENTS.ItemsUpdated ||
        event === EVENTS.ExhaustionLevelChanged) {
        this.initializeValues();
      }
    });
  }

  private initializeValues(): void {
    this.skillAbilityModifier = this.getSkillAbilityModifier();
    this.modifiers = this.creatureService.getModifiers(this.skill.modifiers, this.collection);
    this.modifiersDisplay = this.creatureService.getModifierLabels(this.skill.modifiers, this.collection);
    this.profModifier = this.getProfModifier();
    this.resurrectionPenalty = this.creature.creatureHealth.resurrectionPenalty;
    this.updateTotal();
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeMisc(): void {
    this.proficiency.proficient = this.skill.proficient || this.skill.inheritedFrom.length > 0;
    this.proficiency.doubleProf = this.skill.proficiency.doubleProf;
    this.proficiency.halfProf = this.skill.proficiency.halfProf;
    this.proficiency.roundUp = this.skill.proficiency.roundUp;
    this.proficiency.advantage = this.skill.proficiency.advantage;
    this.proficiency.disadvantage = this.skill.proficiency.disadvantage;
    this.misc = this.creatureService.getModifierValueFromProficiency(this.skill.proficiency);
  }

  saveDetails(): void {
    this.creatureService.updateProficiencyModifier(this.misc, this.skill, this.proficiency);
    this.creatureService.updateAttribute(this.creature, this.skill.proficiency).then(() => {
      if (this.close != null) {
        this.save.emit();
      }
    });
  }

  closeDetails(): void {
    if (this.close != null) {
      this.close.emit();
    }
  }

  miscChange(input): void {
    this.misc = parseInt(input.value, 10);
    this.updateTotal();
  }

  updateTotal(): void {
    this.total = this.skillAbilityModifier + this.modifiers + this.profModifier + this.misc - this.resurrectionPenalty;
  }

  private getProfModifier(): number {
    const profMod = this.creatureService.getProfModifier(this.collection);
    return this.creatureService.getProfModifierValue(profMod, this.proficiency.proficient, this.proficiency);
  }

  private getSkillAbilityModifier(): number {
    return this.creatureService.getSkillAbilityModifier(this.skill, this.creature, this.collection, false, false, false, false);
  }

  proficiencyChange(): void {
    this.profModifier = this.getProfModifier();
    this.updateTotal();
  }
}
