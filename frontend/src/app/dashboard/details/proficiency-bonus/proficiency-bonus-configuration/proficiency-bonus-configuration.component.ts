import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {Proficiency} from '../../../../shared/models/proficiency';
import {CreatureListProficiency} from '../../../../shared/models/creatures/creature-list-proficiency';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {ModifierService} from '../../../../core/services/modifier.service';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS, SID} from '../../../../constants';
import {LabelValue} from '../../../../shared/models/label-value';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-proficiency-bonus-configuration',
  templateUrl: './proficiency-bonus-configuration.component.html',
  styleUrls: ['./proficiency-bonus-configuration.component.scss']
})
export class ProficiencyBonusConfigurationComponent implements OnInit {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

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
  }

  private initializeValues(): void {
    this.bonus = this.creatureService.getMiscModifier(SID.MISC_ATTRIBUTES.PROFICIENCY, this.collection);
    this.initializeProficiency();

    this.base = this.creatureService.getProfModifier(this.collection, false, false);
    this.modifiers = this.creatureService.getModifiers(this.bonus.modifiers, this.collection);
    this.modifiersDisplay = this.creatureService.getModifierLabels(this.bonus.modifiers, this.collection);
    this.updateTotal();
  }

  private initializeProficiency(): void {
    this.proficiency = new Proficiency();
    this.misc = this.creatureService.getModifierValueFromProficiency(this.bonus.proficiency);
  }

  private updateTotal(): void {
    this.total = this.base + this.modifiers + this.misc;
  }

  miscChange(input): void {
    this.misc = parseInt(input.value, 10);
    this.updateTotal();
  }

  closeDetails(): void {
    this.close.emit();
  }

  saveDetails(): void {
    this.creatureService.updateProficiencyModifier(this.misc, this.bonus, this.proficiency);
    this.creatureService.updateAttribute(this.creature, this.bonus.proficiency).then(() => {
      if (this.close != null) {
        this.eventsService.dispatchEvent(EVENTS.ProficiencyUpdated);
        this.save.emit();
      }
    });
  }
}
