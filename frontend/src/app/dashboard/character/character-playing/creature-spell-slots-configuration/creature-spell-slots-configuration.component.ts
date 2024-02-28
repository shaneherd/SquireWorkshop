import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatureSpellSlot} from '../../../../shared/models/creatures/creature-spell-slot';
import * as _ from 'lodash';
import {CreatureSpellSlots} from '../../../../shared/models/creatures/creature-spell-slots';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-creature-spell-slots-configuration',
  templateUrl: './creature-spell-slots-configuration.component.html',
  styleUrls: ['./creature-spell-slots-configuration.component.scss']
})
export class CreatureSpellSlotsConfigurationComponent implements OnInit {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  slots: CreatureSpellSlot[];

  constructor(
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.slots = _.cloneDeep(this.creature.creatureSpellCasting.spellSlots);
  }

  closeDetails(): void {
    this.close.emit();
  }

  clearClick(): void {
    this.slots.forEach((slot: CreatureSpellSlot) => {
      slot.maxModifier = 0;
    });
    this.saveClick();
  }

  private updateRemaining(): void {
    this.slots.forEach((slot: CreatureSpellSlot) => {
      const max = slot.calculatedMax + slot.maxModifier;
      if (slot.remaining > max) {
        slot.remaining = max;
      }
    });
  }

  saveClick(): void {
    this.updateRemaining();
    const creatureSpellSlots = new CreatureSpellSlots();
    creatureSpellSlots.spellSlots = this.slots;
    this.creatureService.updateSpellSlots(this.creature, creatureSpellSlots).then(() => {
      this.eventsService.dispatchEvent(EVENTS.SpellSlotsUpdated);
      this.save.emit();
    });
  }

}
