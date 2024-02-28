import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Item} from '../../../models/items/item';
import {CreatureItem} from '../../../models/creatures/creature-item';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {ItemType} from '../../../models/items/item-type.enum';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-container-display',
  templateUrl: './container-display.component.html',
  styleUrls: ['./container-display.component.scss']
})
export class ContainerDisplayComponent implements OnInit, OnDestroy {
  @Input() item: Item;
  @Input() creatureItem: CreatureItem;
  @Input() class = '';
  @Output() itemClick = new EventEmitter();

  eventSub: Subscription;
  weight = 0.0;
  container = false;

  constructor(
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.container = this.item.container
      || this.item.itemType === ItemType.MOUNT
      || this.item.itemType === ItemType.VEHICLE;

    this.initializeWeight();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ItemsUpdated) {
        this.initializeWeight();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeWeight(): void {
    this.weight = this.creatureService.getNestedItemWeight(this.creatureItem);
  }

  onItemClick(creatureItem: CreatureItem): void {
    this.itemClick.emit(creatureItem);
  }
}
