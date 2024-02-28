import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../models/creatures/configs/creature-configuration-collection';
import {CreatureItem} from '../../../models/creatures/creature-item';
import {Armor} from '../../../models/items/armor';
import {EquipmentSlotType} from '../../../models/items/equipment-slot-type.enum';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Creature} from '../../../models/creatures/creature';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';

@Component({
  selector: 'app-ac-display',
  templateUrl: './ac-display.component.html',
  styleUrls: ['./ac-display.component.scss']
})
export class AcDisplayComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() armor: Armor;
  @Input() class = '';

  eventSub: Subscription;
  acModifier = 0;
  acTooltip = '';
  baseAC = false;

  constructor(
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeAC();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ItemsUpdated
        || event === EVENTS.AbilityScoreChange
        || event === EVENTS.ModifiersUpdated) {
        this.initializeAC();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeAC(): void {
    this.baseAC = this.armor.slot === EquipmentSlotType.BODY;
    this.acModifier = this.creatureService.getArmorAC(this.armor, this.creatureItem, this.collection);
    this.acTooltip = this.creatureService.getArmorACTooltip(this.armor, this.creatureItem, this.collection);
  }

}
