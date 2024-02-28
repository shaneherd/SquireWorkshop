import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CreatureItem} from '../../../../../shared/models/creatures/creature-item';
import {CreatureItemAction} from '../../../../../shared/models/creatures/creature-item-action.enum';
import {ListObject} from '../../../../../shared/models/list-object';
import {CreatureItemService} from '../../../../../core/services/creatures/creature-item.service';
import {Creature} from '../../../../../shared/models/creatures/creature';
import {TranslateService} from '@ngx-translate/core';
import {EVENTS} from '../../../../../constants';
import {EventsService} from '../../../../../core/services/events.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-common-action',
  templateUrl: './common-action.component.html',
  styleUrls: ['./common-action.component.scss']
})
export class CommonActionComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() creatureItem: CreatureItem;
  @Input() creatureItemAction: CreatureItemAction;
  @Input() confirmationMessage: string;
  @Input() containers: ListObject[];
  @Output() continue = new EventEmitter<null>();
  @Output() cancel = new EventEmitter<null>();

  eventSub: Subscription;
  quantity = 1;
  container: ListObject = null;
  loading = false;

  constructor(
    private translate: TranslateService,
    private creatureItemService: CreatureItemService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeContainers();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ItemsUpdated) {
        this.creatureItem = this.getCreatureItem();
        if (this.creatureItem == null || this.creatureItem.quantity === 0) {
          this.cancelClick();
          return;
        }
        this.containers = this.creatureItemService.getContainerList(this.creature, this.creatureItemAction, this.creatureItem);
        this.initializeContainers();
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

  private initializeContainers(): void {
    if (this.containers.length > 0) {
      this.container = this.containers[0];
    }
  }

  continueClick(): void {
    if (this.quantity === 0) {
      this.cancelClick();
    }
    this.loading = true;
    this.creatureItemService.performAction(this.creatureItemAction, this.creature, this.creatureItem, this.quantity, this.container).then(() => {
      this.loading = false;
      this.continue.emit();
    });
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  containerChange(container: ListObject): void {
    this.container = container;
  }
}
