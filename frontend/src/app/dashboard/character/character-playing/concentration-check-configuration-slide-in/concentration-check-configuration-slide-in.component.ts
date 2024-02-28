import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureListProficiency} from '../../../../shared/models/creatures/creature-list-proficiency';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EVENTS, SID} from '../../../../constants';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {AbilityService} from '../../../../core/services/attributes/ability.service';
import {ModifierService} from '../../../../core/services/modifier.service';
import {Proficiency} from '../../../../shared/models/proficiency';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {LabelValue} from '../../../../shared/models/label-value';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-concentration-check-configuration-slide-in',
  templateUrl: './concentration-check-configuration-slide-in.component.html',
  styleUrls: ['./concentration-check-configuration-slide-in.component.scss']
})
export class ConcentrationCheckConfigurationSlideInComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  concentrationProficiency: CreatureListProficiency = null;
  proficiency: Proficiency = new Proficiency();
  conSaveModifier = 0;
  conSave = '0';
  concentrationMisc = 0;
  modifierDisplays: LabelValue[] = [];
  modifiers = 0;
  total = 0;

  constructor(
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private abilityService: AbilityService,
    private modifierService: ModifierService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.AbilityScoreChange
        || event === EVENTS.AbilitySaveChange
        || event === EVENTS.ModifiersUpdated
        || event === EVENTS.ConditionUpdated
        || event === EVENTS.ProficiencyUpdated
        || event === EVENTS.CarryingUpdated
        || event === EVENTS.ItemsUpdated
        || event === EVENTS.ExhaustionLevelChanged) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    const con = this.creatureService.getAbilityBySid(SID.ABILITIES.CONSTITUTION, this.collection);
    this.conSaveModifier = this.creatureService.getAbilitySaveModifier(con, this.creature, this.collection);
    this.conSave = this.abilityService.convertScoreToString(this.conSaveModifier);
    this.concentrationProficiency = this.creatureService.getConcentrationProficiency(this.collection, false);
    this.initializeProficiency();
    const concentrationModifier = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.CONCENTRATION, this.collection);
    this.modifiers = this.creatureService.getModifiers(concentrationModifier.modifiers, this.collection);
    this.modifierDisplays = this.creatureService.getModifierLabels(concentrationModifier.modifiers, this.collection);
    this.updateTotal();
  }

  private initializeProficiency(): void {
    this.proficiency = new Proficiency();
    this.proficiency.proficient = this.concentrationProficiency.proficient || this.concentrationProficiency.inheritedFrom.length > 0;
    this.proficiency.doubleProf = this.concentrationProficiency.proficiency.doubleProf;
    this.proficiency.halfProf = this.concentrationProficiency.proficiency.halfProf;
    this.proficiency.roundUp = this.concentrationProficiency.proficiency.roundUp;
    this.proficiency.advantage = this.concentrationProficiency.proficiency.advantage;
    this.proficiency.disadvantage = this.concentrationProficiency.proficiency.disadvantage;
    this.concentrationMisc = this.creatureService.getModifierValueFromProficiency(this.concentrationProficiency.proficiency);
  }

  private updateTotal(): void {
    this.total = this.conSaveModifier + this.concentrationMisc + this.modifiers;
  }

  closeConfiguration(): void {
    this.close.emit();
  }

  saveConfiguration(): void {
    this.creatureService.updateProficiencyModifier(this.concentrationMisc, this.concentrationProficiency, this.proficiency);
    this.creatureService.updateAttribute(this.creature, this.concentrationProficiency.proficiency).then(() => {
      if (this.close != null) {
        this.eventsService.dispatchEvent(EVENTS.ConcentrationUpdated);
        this.save.emit();
      }
    });
  }

  concentrationModifierChange(input): void {
    this.concentrationMisc = parseInt(input.value, 10);
    this.updateTotal();
  }
}
