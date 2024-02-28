import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureItem} from '../../../../shared/models/creatures/creature-item';
import {Item} from '../../../../shared/models/items/item';
import {ItemTypeValue} from '../../../../constants';
import {Weapon} from '../../../../shared/models/items/weapon';
import {Armor} from '../../../../shared/models/items/armor';
import {Gear} from '../../../../shared/models/items/gear';
import {Tool} from '../../../../shared/models/items/tool';
import {Ammo} from '../../../../shared/models/items/ammo';
import {Mount} from '../../../../shared/models/items/mount';
import {Treasure} from '../../../../shared/models/items/treasure';
import {Pack} from '../../../../shared/models/items/pack';
import {MagicalItem} from '../../../../shared/models/items/magical-item';
import {ItemType} from '../../../../shared/models/items/item-type.enum';
import {Creature} from '../../../../shared/models/creatures/creature';
import {Vehicle} from '../../../../shared/models/items/vehicle';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
  @Input() creatureItem: CreatureItem;
  @Input() item: Item;
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() disabled = false;
  @Input() castable = true;
  @Output() itemClick = new EventEmitter();

  itemTypeValue: ItemTypeValue = 'Item';
  weapon: Weapon = null;
  armor: Armor = null;
  gear: Gear = null;
  tool: Tool = null;
  ammo: Ammo = null;
  mount: Mount = null;
  treasure: Treasure = null;
  pack: Pack = null;
  magicalItem: MagicalItem = null;
  vehicleItem: Vehicle = null;

  constructor() { }

  ngOnInit() {
    this.initializeItemType();
  }

  private initializeItemType(): void {
    if (this.item == null && this.creatureItem != null) {
      this.item = this.creatureItem.item;
    }
    if (this.item == null || this.item.itemType == null) {
      return;
    }
    this.itemTypeValue = this.item.type;
    switch (this.item.itemType) {
      case ItemType.WEAPON:
        this.weapon = this.item as Weapon;
        break;
      case ItemType.ARMOR:
        this.armor = this.item as Armor;
        break;
      case ItemType.GEAR:
        this.gear = this.item as Gear;
        break;
      case ItemType.TOOL:
        this.tool = this.item as Tool;
        break;
      case ItemType.AMMO:
        this.ammo = this.item as Ammo;
        break;
      case ItemType.MOUNT:
        this.mount = this.item as Mount;
        break;
      case ItemType.TREASURE:
        this.treasure = this.item as Treasure;
        break;
      case ItemType.PACK:
        this.pack = this.item as Pack;
        break;
      case ItemType.MAGICAL_ITEM:
        this.magicalItem = this.item as MagicalItem;
        break;
      case ItemType.VEHICLE:
        this.vehicleItem = this.item as Vehicle;
        break;
    }
  }

  onItemClick(creatureItem: CreatureItem): void {
    this.itemClick.emit(creatureItem);
  }

}
