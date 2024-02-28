import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureSpellSlot} from '../../../../shared/models/creatures/creature-spell-slot';
import * as _ from 'lodash';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureSpellSlots} from '../../../../shared/models/creatures/creature-spell-slots';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-creature-spell-slots-slide-in',
  templateUrl: './creature-spell-slots-slide-in.component.html',
  styleUrls: ['./creature-spell-slots-slide-in.component.scss']
})
export class CreatureSpellSlotsSlideInComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();

  eventSub: Subscription;
  slots: CreatureSpellSlot[];
  configuring = false;

  constructor(
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.SpellSlotsUpdated) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.slots = _.cloneDeep(this.creature.creatureSpellCasting.spellSlots);
  }

  configure(): void {
    this.configuring = true;
  }

  closeConfiguration(): void {
    this.configuring = false;
  }

  saveConfiguration(): void {
    this.configuring = false;
    this.initializeValues();
  }

  closeDetails(): void {
    this.close.emit();
  }

  resetClick(): void {
    this.slots.forEach((slot: CreatureSpellSlot) => {
      slot.remaining = this.creatureService.getMaxSpellSlots(slot, this.collection);
    });
    this.saveClick();
  }

  saveClick(): void {
    const creatureSpellSlots = new CreatureSpellSlots();
    creatureSpellSlots.spellSlots = this.slots;
    this.creatureService.updateSpellSlots(this.creature, creatureSpellSlots).then(() => {
      this.eventsService.dispatchEvent(EVENTS.SpellSlotsUpdated);
      this.save.emit();
    });
  }

}
