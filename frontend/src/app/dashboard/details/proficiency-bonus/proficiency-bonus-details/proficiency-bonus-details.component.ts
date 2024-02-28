import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {ModifierService} from '../../../../core/services/modifier.service';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EVENTS, SID} from '../../../../constants';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Proficiency} from '../../../../shared/models/proficiency';
import {CreatureListProficiency} from '../../../../shared/models/creatures/creature-list-proficiency';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';
import {LabelValue} from '../../../../shared/models/label-value';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-proficiency-bonus-details',
  templateUrl: './proficiency-bonus-details.component.html',
  styleUrls: ['./proficiency-bonus-details.component.scss']
})
export class ProficiencyBonusDetailsComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  configuring = false;
  base = 0;
  modifiers = 0;
  modifiersDisplay: LabelValue[] = [];
  misc = 0;
  total = 0;

  proficiency: Proficiency = new Proficiency();
  bonus: CreatureListProficiency;

  constructor(
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private modifierService: ModifierService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ProficiencyUpdated
        || event === EVENTS.LevelUpdated
        || event === EVENTS.ModifiersUpdated) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.bonus = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.PROFICIENCY, this.collection);
    this.initializeProficiency();

    this.base = this.creatureService.getProfModifier(this.collection, false, false);
    this.modifiers = this.creatureService.getModifiers(this.bonus.modifiers, this.collection);
    this.modifiersDisplay = this.creatureService.getModifierLabels(this.bonus.modifiers, this.collection);
    this.updateTotal();
  }

  configure(): void {
    this.configuring = true;
  }

  closeConfigurations(): void {
    this.configuring = false;
  }

  saveConfigurations(): void {
    this.configuring = false;
    this.initializeValues();
  }

  private initializeProficiency(): void {
    this.proficiency = new Proficiency();
    this.misc = this.creatureService.getModifierValueFromProficiency(this.bonus.proficiency);
  }

  private updateTotal(): void {
    this.total = this.base + this.modifiers + this.misc;
  }

  closeDetails(): void {
    this.close.emit();
  }
}
