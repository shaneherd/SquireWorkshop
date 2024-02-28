import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {ItemType} from '../../../../shared/models/items/item-type.enum';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CreatureItemState} from '../../../../shared/models/creatures/creature-item-state.enum';
import {Subscription} from 'rxjs';
import {MagicalItemSpellConfiguration} from '../../../../shared/models/items/magical-item-spell-configuration';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';

@Component({
  selector: 'app-creature-equipment',
  templateUrl: './creature-equipment.component.html',
  styleUrls: ['./creature-equipment.component.scss']
})
export class CreatureEquipmentComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() columnIndex: number;
  @Input() fromEncounter = false;

  playerCharacter: PlayerCharacter = null;

  eventSub: Subscription;
  viewingSettings = false;
  viewingWealth = false;
  viewingItem: CreatureItem = null;
  addingItem = false;
  viewingAttunement = false;
  viewingCharges = false;
  clickDisabled = false;

  equippedItems: CreatureItem[] = [];
  carriedItems: CreatureItem[] = [];
  droppedItems: CreatureItem[] = [];
  mountItems: CreatureItem[] = [];
  stabledMountItems: CreatureItem[] = [];
  vehicleItems: CreatureItem[] = [];
  expendedAmmoItems: CreatureItem[] = [];

  constructor(
    private eventsService: EventsService,
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    if (this.creature != null && this.creature.creatureType === CreatureType.CHARACTER) {
      this.playerCharacter = this.creature as PlayerCharacter;
    }
    this.initializeItems();

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.FetchItemsList) {
        this.fetchItems();
      } else if (event === (EVENTS.MenuAction.AddItems + this.columnIndex)) {
        this.addItem();
      } else if (event === (EVENTS.MenuAction.ItemSettings + this.columnIndex)) {
        this.settingsClick();
      } else if (event === (EVENTS.MenuAction.ItemAttunement + this.columnIndex)) {
        this.attunementClick();
      } else if (event === (EVENTS.MenuAction.ItemCharges + this.columnIndex)) {
        this.chargesClick();
      } else if (event === EVENTS.ItemsUpdated) {
        if (this.viewingItem != null) {
          this.itemClick(this.viewingItem);
        }
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private fetchItems(): void {
    this.creatureService.getItems(this.creature).then((items: CreatureItem[]) => {
      this.creature.items = items;
      this.initializeItems();
      this.eventsService.dispatchEvent(EVENTS.ItemsUpdated);
    });
  }

  private addItem(): void {
    if (!this.clickDisabled) {
      this.addingItem = true;
      this.updateClickDisabled();
    }
  }

  addSelectedItems(): void {
    this.addingItem = false;
    this.eventsService.dispatchEvent(EVENTS.FetchItemsList);
    this.updateClickDisabled();
  }

  itemListClose(): void {
    this.addingItem = false;
    this.updateClickDisabled();
  }

  private settingsClick(): void {
    this.viewingSettings = true;
  }

  private initializeItems(): void {
    this.equippedItems = [];
    this.carriedItems = [];
    this.droppedItems = [];
    this.mountItems = [];
    this.stabledMountItems = [];
    this.vehicleItems = [];
    this.expendedAmmoItems = [];

    this.creature.items.forEach((creatureItem: CreatureItem) => {
      if (creatureItem.creatureItemState === CreatureItemState.EQUIPPED && creatureItem.equipmentSlot != null && creatureItem.equipmentSlot.id !== '0') {
        this.equippedItems.push(creatureItem);
      } else if (creatureItem.itemType === ItemType.MOUNT) {
        if (creatureItem.creatureItemState === CreatureItemState.DROPPED) {
          this.stabledMountItems.push(creatureItem);
        } else if (creatureItem.creatureItemState === CreatureItemState.CARRIED) {
          this.mountItems.push(creatureItem);
        }
      } else if (creatureItem.itemType === ItemType.VEHICLE) {
        this.vehicleItems.push(creatureItem);
      } else if ((creatureItem.itemType === ItemType.AMMO || creatureItem.itemType === ItemType.MAGICAL_ITEM) && creatureItem.creatureItemState === CreatureItemState.EXPENDED) {
        this.expendedAmmoItems.push(creatureItem);
      } else if (creatureItem.creatureItemState === CreatureItemState.DROPPED) {
        this.droppedItems.push(creatureItem);
      } else if (creatureItem.creatureItemState === CreatureItemState.CARRIED) {
        this.carriedItems.push(creatureItem);
      }
    });

    //todo - sort equipped items by slot
  }

  spellClick(config: MagicalItemSpellConfiguration): void {
    //todo
  }

  itemClick(creatureItem: CreatureItem): void {
    this.viewingItem = creatureItem;
    this.updateClickDisabled();
  }

  saveItem(): void {
    this.viewingItem = null;
    this.updateClickDisabled();
    this.eventsService.dispatchEvent(EVENTS.FetchItemsList);
  }

  closeItem(): void {
    this.viewingItem = null;
    this.updateClickDisabled();
  }

  wealthClick(): void {
    this.viewingWealth = true;
    this.updateClickDisabled();
  }

  saveWealth(): void {
    this.viewingWealth = false;
    this.updateClickDisabled();
  }

  closeWealth(): void {
    this.viewingWealth = false;
    this.updateClickDisabled();
  }

  saveSettings(): void {
    this.viewingSettings = false;
    this.updateClickDisabled();
    this.eventsService.dispatchEvent(EVENTS.EquipmentSettingsUpdated);
  }

  closeSettings(): void {
    this.viewingSettings = false;
    this.updateClickDisabled();
  }

  private attunementClick(): void {
    this.viewingAttunement = true;
  }

  saveAttunement(): void {
    this.viewingAttunement = false;
    this.updateClickDisabled();
    this.eventsService.dispatchEvent(EVENTS.FetchItemsList);
  }

  resetAttunement(): void {
    this.viewingAttunement = false;
    this.updateClickDisabled();
    this.eventsService.dispatchEvent(EVENTS.FetchItemsList);
  }

  cancelAttunement(): void {
    this.viewingAttunement = false;
    this.updateClickDisabled();
  }

  private chargesClick(): void {
    this.viewingCharges = true;
  }

  saveCharges(): void {
    this.viewingCharges = false;
    this.updateClickDisabled();
    this.eventsService.dispatchEvent(EVENTS.FetchItemsList);
  }

  rechargeCharges(): void {
    this.viewingCharges = false;
    this.updateClickDisabled();
    this.eventsService.dispatchEvent(EVENTS.FetchItemsList);
  }

  cancelCharges(): void {
    this.viewingCharges = false;
    this.updateClickDisabled();
  }

  private updateClickDisabled(): void {
    this.clickDisabled = this.viewingWealth || this.viewingItem != null || this.addingItem
      || this.viewingSettings || this.viewingAttunement || this.viewingCharges;
  }

}
