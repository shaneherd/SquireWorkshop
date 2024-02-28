import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {CreatureItemService} from '../../../../core/services/creatures/creature-item.service';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-creature-equipment-charges',
  templateUrl: './creature-equipment-charges.component.html',
  styleUrls: ['./creature-equipment-charges.component.scss']
})
export class CreatureEquipmentChargesComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Output() save = new EventEmitter();
  @Output() recharge = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = false;
  creatureItems: CreatureItem[] = [];
  eventSub: Subscription;

  constructor(
    private creatureItemService: CreatureItemService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeItems();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ItemsUpdated) {
        this.initializeItems();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeItems(): void {
    const items: CreatureItem[] = [];
    const flatList = this.creatureItemService.getFlatItemList(this.creature.items);
    flatList.forEach((creatureItem: CreatureItem) => {
      if (creatureItem.maxCharges > 0) {
        items.push(_.cloneDeep(creatureItem));
      }
    });
    this.creatureItems = items;
  }

  onSave(): void {
    this.loading = true;
    this.creatureItemService.updateItems(this.creatureItems, this.creature).then(() => {
      this.loading = false;
      this.save.emit();
    });
  }

  onRecharge(): void {
    this.loading = true;
    this.creatureItemService.rechargeItems(this.creatureItems, this.creature).then(() => {
      this.loading = false;
      this.recharge.emit();
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
