import { Injectable } from '@angular/core';
import {AttributeService} from '../attributes/attribute.service';
import {CharacteristicService} from '../characteristics/characteristic.service';
import {PowerService} from '../powers/power.service';
import {ItemService} from '../items/item.service';
import {Item} from '../../../shared/models/items/item';
import {Power} from '../../../shared/models/powers/power';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';

class ExportSourceCache {
  attributes = new Map<string, Attribute>();
  characteristics = new Map<string, Characteristic>();
  powers = new Map<string, Power>();
  items = new Map<string, Item>();
}

@Injectable({
  providedIn: 'root'
})
export class ExportCacheService {
  private exportSourceCache = new ExportSourceCache();

  constructor(
    private attributeService: AttributeService,
    private characteristicService: CharacteristicService,
    private powerService: PowerService,
    private itemService: ItemService
  ) { }

  clearCache(): void {
    this.exportSourceCache.attributes = new Map<string, Attribute>();
    this.exportSourceCache.characteristics = new Map<string, Characteristic>();
    this.exportSourceCache.powers = new Map<string, Power>();
    this.exportSourceCache.items = new Map<string, Item>();
  }

  getItem(id: string): Promise<Item> {
    if (this.exportSourceCache.items.has(id)) {
      return Promise.resolve(this.exportSourceCache.items.get(id));
    } else {
      return this.itemService.getItem(id).then((item: Item) => {
        this.exportSourceCache.items.set(id, item);
        return item;
      });
    }
  }

  getPower(id: string): Promise<Power> {
    if (this.exportSourceCache.powers.has(id)) {
      return Promise.resolve(this.exportSourceCache.powers.get(id));
    } else {
      return this.powerService.getPower(id).then((power: Power) => {
        this.exportSourceCache.powers.set(id, power);
        return power;
      });
    }
  }

  getAttribute(id: string): Promise<Attribute> {
    if (this.exportSourceCache.attributes.has(id)) {
      return Promise.resolve(this.exportSourceCache.attributes.get(id));
    } else {
      return this.attributeService.getAttribute(id).then((attribute: Attribute) => {
        this.exportSourceCache.attributes.set(id, attribute);
        return attribute;
      });
    }
  }

  getCharacteristic(id: string): Promise<Characteristic> {
    if (this.exportSourceCache.characteristics.has(id)) {
      return Promise.resolve(this.exportSourceCache.characteristics.get(id));
    } else {
      return this.characteristicService.getCharacteristic(id).then((characteristic: Characteristic) => {
        this.exportSourceCache.characteristics.set(id, characteristic);
        return characteristic;
      });
    }
  }
}
