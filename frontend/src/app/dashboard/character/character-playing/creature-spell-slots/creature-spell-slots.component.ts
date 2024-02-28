import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';
import {CreatureSpellSlot} from '../../../../shared/models/creatures/creature-spell-slot';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureSpellSlots} from '../../../../shared/models/creatures/creature-spell-slots';
import * as _ from 'lodash';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-creature-spell-slots',
  templateUrl: './creature-spell-slots.component.html',
  styleUrls: ['./creature-spell-slots.component.scss']
})
export class CreatureSpellSlotsComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() clickDisabled = false;
  @Output() configuringClick = new EventEmitter();
  @Output() configuringClose = new EventEmitter();

  eventSub: Subscription;
  viewingSpellSlots = false;

  constructor(
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ModifiersUpdated) {
        this.updateSpellSlots();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private updateSpellSlots(): void {
    let updated = false;
    const slots = _.cloneDeep(this.creature.creatureSpellCasting.spellSlots);
    slots.forEach((creatureSpellSlot: CreatureSpellSlot) => {
      const max = this.creatureService.getMaxSpellSlots(creatureSpellSlot, this.collection);
      if (creatureSpellSlot.remaining > max) {
        creatureSpellSlot.remaining = max;
        updated = true;
      }
    });

    if (updated) {
      const creatureSpellSlots = new CreatureSpellSlots();
      creatureSpellSlots.spellSlots = slots;
      this.creatureService.updateSpellSlots(this.creature, creatureSpellSlots).then(() => {
        this.creature.creatureSpellCasting.spellSlots = slots;
      });
    }
  }

  spellSlotsClick(): void {
    if (!this.clickDisabled) {
      this.viewingSpellSlots = true;
      this.configuringClick.emit();
    }
  }

  closeSpellSlots(): void {
    this.viewingSpellSlots = false;
    this.configuringClose.emit();
  }

  saveSpellSlots(): void {
    this.viewingSpellSlots = false;
    this.configuringClose.emit();
  }
}
