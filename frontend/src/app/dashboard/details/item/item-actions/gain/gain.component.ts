import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureItem} from '../../../../../shared/models/creatures/creature-item';
import {Item} from '../../../../../shared/models/items/item';
import {ItemQuantity} from '../../../../../shared/models/items/item-quantity';
import {ItemListObject} from '../../../../../shared/models/items/item-list-object';
import {Creature} from '../../../../../shared/models/creatures/creature';
import {EVENTS} from '../../../../../constants';
import {EventsService} from '../../../../../core/services/events.service';
import {CreatureItemAction} from '../../../../../shared/models/creatures/creature-item-action.enum';
import {CreatureItemService} from '../../../../../core/services/creatures/creature-item.service';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-gain',
  templateUrl: './gain.component.html',
  styleUrls: ['./gain.component.scss']
})
export class GainComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() creatureItem: CreatureItem;
  @Input() item: Item;
  @Output() continue = new EventEmitter<null>();
  @Output() cancel = new EventEmitter<null>();

  id = _.uniqueId();
  eventSub: Subscription;
  loading = false;
  items: ItemQuantity[] = [];
  itemQuantity: ItemQuantity = new ItemQuantity();

  constructor(
    private eventsService: EventsService,
    private creatureItemService: CreatureItemService
  ) { }

  ngOnInit() {
    this.initializeItems();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ItemsUpdated) {
        this.creatureItem = this.getCreatureItem();
        if (this.creatureItem == null || this.creatureItem.quantity === 0) {
          this.cancelClick();
          return;
        }
        this.initializeItems();
      }
    });
  }

  private getCreatureItem(): CreatureItem {
    const flatItems = this.creatureItemService.getFlatItemList(this.creature.items);
    for (let i = 0; i < flatItems.length; i++) {
      const creatureItem = flatItems[i];
      if (creatureItem.id === this.creatureItem.id) {
        return creatureItem;
      }
    }
    return null;
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeItems(): void {
    const items: ItemQuantity[] = [];
    const itemQuantity = new ItemQuantity();
    itemQuantity.quantity = 1;
    itemQuantity.item = new ItemListObject(this.item.id, this.item.name, this.item.sid, this.item.cost, this.item.costUnit.id);
    items.push(itemQuantity);

    this.itemQuantity = itemQuantity;
    this.items = items;

    if (this.itemQuantity.quantity === 0) {
      this.cancelClick();
    }
  }

  quantityChange(input): void {
    this.itemQuantity.quantity = parseInt(input.value, 10);
    this.eventsService.dispatchEvent(EVENTS.CartItemsChanged);
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  continueClick(): void {
    this.eventsService.dispatchEvent(EVENTS.SaveWealthAdjustments + this.id);
  }

  continueGain(): void {
    this.creatureItemService.performAction(CreatureItemAction.GAIN, this.creature, this.creatureItem, this.itemQuantity.quantity).then(() => {
      this.continue.emit();
    });
  }
}
