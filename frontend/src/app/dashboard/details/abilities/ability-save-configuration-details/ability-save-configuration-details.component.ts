import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureAbilityProficiency} from '../../../../shared/models/creatures/configs/creature-ability-proficiency';
import {Proficiency} from '../../../../shared/models/proficiency';
import {ModifierService} from '../../../../core/services/modifier.service';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';
import {LabelValue} from '../../../../shared/models/label-value';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-ability-save-configuration-details',
  templateUrl: './ability-save-configuration-details.component.html',
  styleUrls: ['./ability-save-configuration-details.component.scss']
})
export class AbilitySaveConfigurationDetailsComponent implements OnInit, OnDestroy {
  @Input() creatureAbilityProficiency: CreatureAbilityProficiency;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  abilityModifier = 0;
  profModifier = 0;
  misc = 0;
  proficiency: Proficiency = new Proficiency();
  modifiersDisplay: LabelValue[] = [];
  modifiers = 0;
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
      if (event === (EVENTS.AbilityScoreChange + this.creatureAbilityProficiency.ability.id) ||
        event === (EVENTS.AbilitySaveChange + this.creatureAbilityProficiency.ability.id) ||
        event === EVENTS.ModifiersUpdated ||
        event === EVENTS.ConditionUpdated ||
        event === EVENTS.ProficiencyUpdated ||
        event === EVENTS.CarryingUpdated ||
        event === EVENTS.ItemsUpdated ||
        event === EVENTS.ExhaustionLevelChanged) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.abilityModifier = this.getAbilityModifier();
    this.profModifier = this.getProfModifier();
    this.modifiers = this.creatureService.getModifiers(this.creatureAbilityProficiency.saveModifiers, this.collection);
    this.modifiersDisplay = this.creatureService.getModifierLabels(this.creatureAbilityProficiency.saveModifiers, this.collection);
    this.resurrectionPenalty = this.creature.creatureHealth.resurrectionPenalty;
    this.updateTotal();
  }

  private initializeMisc(): void {
    const proficiency = this.creatureAbilityProficiency.saveProficiency.proficiency;
    this.proficiency.proficient = this.creatureAbilityProficiency.saveProficiency.proficient
      || this.creatureAbilityProficiency.saveProficiency.inheritedFrom.length > 0;
    this.proficiency.doubleProf = proficiency.doubleProf;
    this.proficiency.halfProf = proficiency.halfProf;
    this.proficiency.roundUp = proficiency.roundUp;
    this.proficiency.advantage = proficiency.advantage;
    this.proficiency.disadvantage = proficiency.disadvantage;
    this.misc = this.creatureService.getModifierValueFromProficiency(proficiency);
  }

  isProficiencyDisabled(): boolean {
    return this.creatureAbilityProficiency.saveProficiency.inheritedFrom.length > 0;
  }

  saveDetails(): void {
    this.creatureService.updateProficiencyModifier(this.misc, this.creatureAbilityProficiency.saveProficiency, this.proficiency);
    this.creatureService.updateAttribute(this.creature, this.creatureAbilityProficiency.saveProficiency.proficiency).then(() => {
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

  private updateTotal(): void {
    this.total = this.abilityModifier + this.profModifier + this.misc + this.modifiers - this.resurrectionPenalty;
  }

  private getProfModifier(): number {
    const profMod = this.creatureService.getProfModifier(this.collection);
    return this.creatureService.getProfModifierValue(profMod, this.proficiency.proficient, this.proficiency);
  }

  proficiencyChange(): void {
    this.profModifier = this.getProfModifier();
    this.updateTotal();
  }

  private getAbilityModifier(): number {
    return this.creatureService.getAbilityModifier(this.creatureAbilityProficiency, this.collection);
  }
}
