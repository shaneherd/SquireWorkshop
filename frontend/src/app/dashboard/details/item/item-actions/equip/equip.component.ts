import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Creature} from '../../../../../shared/models/creatures/creature';
import {CreatureItem} from '../../../../../shared/models/creatures/creature-item';
import {ListObject} from '../../../../../shared/models/list-object';
import {ItemType} from '../../../../../shared/models/items/item-type.enum';
import {CreatureItemService} from '../../../../../core/services/creatures/creature-item.service';
import {EquipmentSlotService} from '../../../../../core/services/items/equipment-slot.service';
import {Item} from '../../../../../shared/models/items/item';
import {EquipmentSlot} from '../../../../../shared/models/items/equipment-slot';
import {Weapon} from '../../../../../shared/models/items/weapon';
import {ItemService} from '../../../../../core/services/items/item.service';
import {CreatureItemAction} from '../../../../../shared/models/creatures/creature-item-action.enum';
import {CreatureConfigurationCollection} from '../../../../../shared/models/creatures/configs/creature-configuration-collection';
import {NotificationService} from '../../../../../core/services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import {EVENTS} from '../../../../../constants';
import {EventsService} from '../../../../../core/services/events.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-equip',
  templateUrl: './equip.component.html',
  styleUrls: ['./equip.component.scss']
})
export class EquipComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() creatureItem: CreatureItem;
  @Input() item: Item;
  @Output() continue = new EventEmitter<null>();
  @Output() cancel = new EventEmitter<null>();

  eventSub: Subscription;
  loading = false;
  containers: ListObject[] = [];
  selectedContainer: ListObject;
  slots: EquipmentSlot[] = [];
  slot: EquipmentSlot = null;
  equippedItems: CreatureItem[] = [];
  viewingItem: CreatureItem = null;

  constructor(
    private itemService: ItemService,
    private creatureItemService: CreatureItemService,
    private equipmentSlotService: EquipmentSlotService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.initializeContainers();
    this.initializeSlots();

    if (this.slots.length === 1 && this.equippedItems.length === 0) {
      this.continueClick();
    }
    this.loading = false;

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.ItemsUpdated) {
        this.creatureItem = this.getCreatureItem();
        if (this.creatureItem == null || this.creatureItem.quantity === 0) {
          this.cancelClick();
          return;
        }
        this.initializeContainers();
        this.updateEquippedItems();
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
    if (this.creatureItem.itemType !== ItemType.MOUNT) {
      const containers = this.creatureItemService.getAllContainers(this.creature, null);
      this.containers = this.creatureItemService.getContainersAsList(containers);
    } else {
      this.containers = [];
    }

    if (this.containers.length > 0) {
      this.containerChange(this.containers[0]);
    }
  }

  private initializeSlots(): void {
    let slot = this.creatureItemService.getCreatureItemEquipmentSlotType(this.creatureItem);
    if (slot == null) {
      slot = this.item.slot;
    }
    this.slots = this.equipmentSlotService.getEquipmentSlotsByType(slot);
    if (this.slots.length > 0) {
      this.slotChange(this.slots[0]);
    }
  }

  slotChange(slot: EquipmentSlot): void {
    this.slot = slot;
    this.updateEquippedItems();
  }

  private updateEquippedItems(): void {
    let slots: EquipmentSlot[] = [];
    slots.push(this.slot);
    if (this.item.itemType === ItemType.WEAPON) {
      const weapon = this.item as Weapon;
      if (this.itemService.isTwoHanded(weapon)) {
        slots = this.slots;
      }
    }
    this.equippedItems = this.creatureItemService.getEquippedItemsBySlot(slots, this.creature);
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  continueClick(): void {
    const promises: Promise<any>[] = [];
    this.getUniqueEquippedItems().forEach((equippedItem: CreatureItem) => {
      promises.push(this.creatureItemService.performAction(CreatureItemAction.UNEQUIP, this.creature, equippedItem, 1, this.selectedContainer));
    });
    Promise.all(promises).then(() => {
      this.creatureItemService.performAction(CreatureItemAction.EQUIP, this.creature, this.creatureItem, 1, this.selectedContainer, this.getSlot()).then(() => {
        this.loading = false;
        this.continue.emit();
      });
    }, () => {
      this.notificationService.error(this.translate.instant('Error'));
      this.loading = false;
      this.continue.emit();
    });
  }

  private getUniqueEquippedItems(): CreatureItem[] {
    const items: CreatureItem[] = [];
    this.equippedItems.forEach((creatureItem: CreatureItem) => {
      if (!this.containsItem(items, creatureItem)) {
        items.push(creatureItem);
      }
    });
    return items;
  }

  private containsItem(items: CreatureItem[], item: CreatureItem): boolean {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === item.id) {
        return true;
      }
    }
    return false;
  }

  private getSlot(): ListObject {
    return new ListObject(this.slot.id);
  }

  itemClick(creatureItem: CreatureItem): void {
    this.viewingItem = creatureItem;
  }

  closeItem(): void {
    this.viewingItem = null;
  }

  containerChange(container: ListObject): void {
    this.selectedContainer = container;
  }

}
