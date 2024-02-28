import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Item} from '../../../models/items/item';
import {CreatureItem} from '../../../models/creatures/creature-item';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';
import {ItemType} from '../../../models/items/item-type.enum';

@Component({
  selector: 'app-weight-display',
  templateUrl: './weight-display.component.html',
  styleUrls: ['./weight-display.component.scss']
})
export class WeightDisplayComponent implements OnInit, OnDestroy {
  @Input() creatureItem: CreatureItem;
  @Input() item: Item;

  eventSub: Subscription;
  weight = 0.0;
  totalWeight = 0.0;

  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeValues();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ItemsUpdated) {
        this.initializeValues();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeValues(): void {
    this.weight = this.item.weight;
    if (this.creatureItem != null) {
      if (this.weight === 0 && this.item.itemType === ItemType.MAGICAL_ITEM && this.creatureItem.magicalItem != null) {
        this.weight = this.creatureItem.magicalItem.weight;
      }
      this.totalWeight = Math.round(this.weight * this.creatureItem.quantity * 1000) / 1000.0;
    }
  }

}
