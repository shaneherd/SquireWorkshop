import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureListProficiency} from '../../../../shared/models/creatures/creature-list-proficiency';
import {Proficiency} from '../../../../shared/models/proficiency';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {ModifierService} from '../../../../core/services/modifier.service';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS, SID} from '../../../../constants';
import {Subscription} from 'rxjs';
import {LabelValue} from '../../../../shared/models/label-value';

@Component({
  selector: 'app-initiative-configuration',
  templateUrl: './initiative-configuration.component.html',
  styleUrls: ['./initiative-configuration.component.scss']
})
export class InitiativeConfigurationComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  base = 0;
  modifiers = 0;
  modifiersDisplay: LabelValue[] = [];
  misc = 0;
  total = 0;

  initiative: CreatureListProficiency;
  proficiency: Proficiency = new Proficiency();
  profModifier = 0;

  constructor(
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private modifierService: ModifierService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeInitiative();
    this.initializeProficiency();
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ModifiersUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.ProficiencyUpdated) {
        this.initializeInitiative();
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.base = this.creatureService.getInitiativeModifier(this.collection, false, false, false);
    this.modifiers = this.creatureService.getModifiers(this.initiative.modifiers, this.collection);
    this.modifiersDisplay = this.creatureService.getModifierLabels(this.initiative.modifiers, this.collection);
    this.profModifier = this.getProfModifier();
    this.updateTotal();
  }

  private initializeInitiative(): void {
    this.initiative = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.INITIATIVE, this.collection);
  }

  private initializeProficiency(): void {
    this.proficiency = new Proficiency();
    this.proficiency.proficient = this.initiative.proficient || this.initiative.inheritedFrom.length > 0;
    this.proficiency.doubleProf = this.initiative.proficiency.doubleProf;
    this.proficiency.halfProf = this.initiative.proficiency.halfProf;
    this.proficiency.roundUp = this.initiative.proficiency.roundUp;
    this.proficiency.advantage = this.initiative.proficiency.advantage;
    this.proficiency.disadvantage = this.initiative.proficiency.disadvantage;
    this.misc = this.creatureService.getModifierValueFromProficiency(this.initiative.proficiency);
  }

  private getProfModifier(): number {
    const profMod = this.creatureService.getProfModifier(this.collection);
    return this.creatureService.getProfModifierValue(profMod, this.proficiency.proficient, this.proficiency);
  }

  proficiencyChange(): void {
    this.profModifier = this.getProfModifier();
    this.updateTotal();
  }

  private updateTotal(): void {
    this.total = this.base + this.modifiers + this.profModifier + this.misc;
  }

  miscChange(input): void {
    this.misc = parseInt(input.value, 10);
    this.updateTotal();
  }

  closeDetails(): void {
    this.close.emit();
  }

  saveDetails(): void {
    this.creatureService.updateProficiencyModifier(this.misc, this.initiative, this.proficiency);
    this.creatureService.updateAttribute(this.playerCharacter, this.initiative.proficiency).then(() => {
      this.eventsService.dispatchEvent(EVENTS.InitiativeUpdated);
      this.save.emit();
    });
  }
}
