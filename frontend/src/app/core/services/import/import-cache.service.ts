import {Injectable} from '@angular/core';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {ListObject} from '../../../shared/models/list-object';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {ItemType} from '../../../shared/models/items/item-type.enum';
import {CreatureType} from '../../../shared/models/creatures/creature-type.enum';
import {CostUnit} from '../../../shared/models/items/cost-unit';
import {AttributeService} from '../attributes/attribute.service';
import {CharacteristicService} from '../characteristics/characteristic.service';
import {PowerService} from '../powers/power.service';
import {ItemService} from '../items/item.service';
import {CreatureService} from '../creatures/creature.service';
import * as _ from 'lodash';
import {ImportItemCategory} from '../../../shared/imports/import-item';
import {LOCAL_STORAGE} from '../../../constants';
import {FeatureListObject} from '../../../shared/models/powers/feature-list-object';
import {ListSource} from '../../../shared/models/list-source.enum';
import {MonsterService} from '../creatures/monster.service';

class ImportSourceCache {
  attributes = new Map<AttributeType, ListObject[]>();
  characteristics = new Map<CharacteristicType, ListObject[]>();
  powers = new Map<PowerType, ListObject[]>();
  features = new Map<CharacteristicType, FeatureListObject[]>();
  items = new Map<ItemType, ListObject[]>();
  creatures = new Map<CreatureType, ListObject[]>();
  monsters: ListObject[] = [];
  costUnits: CostUnit[] = [];
}

class ImportCategoryExpandedSource {
  armorType = true;
  damageType = true;
  areaOfEffect = true;
  casterType = true;
  condition = true;
  language = true;
  skill = true;
  weaponProperty = true;
  background = true;
  characterClass = true;
  race = true;
  feature = true;
  spell = true;
  equipment = true;
  pack = true;
  character = true;
  monster = true;
}

@Injectable({
  providedIn: 'root'
})
export class ImportCacheService {
  private importSourceCache = new ImportSourceCache();

  constructor(
    private attributeService: AttributeService,
    private characteristicService: CharacteristicService,
    private powerService: PowerService,
    private itemService: ItemService,
    private creatureService: CreatureService,
    private monsterService: MonsterService
  ) { }

  clearCache(): void {
    this.importSourceCache.attributes = new Map<AttributeType, ListObject[]>();
    this.importSourceCache.characteristics = new Map<CharacteristicType, ListObject[]>();
    this.importSourceCache.powers = new Map<PowerType, ListObject[]>();
    this.importSourceCache.features = new Map<CharacteristicType, FeatureListObject[]>();
    this.importSourceCache.items = new Map<ItemType, ListObject[]>();
    this.importSourceCache.creatures = new Map<CreatureType, ListObject[]>();
    this.importSourceCache.monsters = [];
    // this.importSourceCache.costUnits = [];
  }

  getAllAttributes(): ListObject[] {
    let list: ListObject[] = [];
    this.importSourceCache.attributes.forEach((attributes: ListObject[]) => {
      list = list.concat(attributes);
    });
    return list;
  }

  getAttributes(attributeType: AttributeType): ListObject[] {
    return this.importSourceCache.attributes.get(attributeType);
  }

  getAttributesByType(attributeType: AttributeType): Promise<ListObject[]> {
    const cached = this.importSourceCache.attributes.get(attributeType);
    if (cached == null || cached.length === 0) {
      return this.attributeService.getAttributesByAttributeType(attributeType, ListSource.MY_STUFF).then((attributes: ListObject[]) => {
        this.importSourceCache.attributes.set(attributeType, attributes);
        return attributes;
      });
    } else {
      return Promise.resolve(cached);
    }
  }

  getCharacteristics(characteristicType: CharacteristicType): ListObject[] {
    return this.importSourceCache.characteristics.get(characteristicType);
  }

  async deleteCharacteristic(characteristicType: CharacteristicType, characteristicId: string): Promise<any> {
    const characteristics: ListObject[] = await this.getCharacteristicsByType(characteristicType);
    if (characteristics != null) {
      const index = _.findIndex(characteristics, (characteristic: ListObject) => { return characteristic.id === characteristicId; });
      if (index > -1) {
        characteristics.splice(index);
      }
      this.importSourceCache.characteristics.set(characteristicType, characteristics);
    }
  }

  getCharacteristicsByType(characteristicType: CharacteristicType): Promise<ListObject[]> {
    const cached = this.importSourceCache.characteristics.get(characteristicType);
    if (cached == null || cached.length === 0) {
      return this.characteristicService.getCharacteristicsByCharacteristicType(characteristicType).then((attributes: ListObject[]) => {
        this.importSourceCache.characteristics.set(characteristicType, attributes);
        return attributes;
      });
    } else {
      return Promise.resolve(cached);
    }
  }

  getPowers(powerType: PowerType): ListObject[] {
    return this.importSourceCache.powers.get(powerType);
  }

  async deletePower(powerType: PowerType, powerId: string): Promise<any> {
    const powers: ListObject[] = await this.getPowersByType(powerType);
    if (powers != null) {
      const index = _.findIndex(powers, (power: ListObject) => { return power.id === powerId; });
      if (index > -1) {
        powers.splice(index);
      }
      this.importSourceCache.powers.set(powerType, powers);
    }
  }

  getPowersByType(powerType: PowerType): Promise<ListObject[]> {
    const cached = this.importSourceCache.powers.get(powerType);
    if (cached == null || cached.length === 0) {
      return this.powerService.getPowersByPowerType(powerType).then((powers: ListObject[]) => {
        this.importSourceCache.powers.set(powerType, powers);
        return powers;
      });
    } else {
      return Promise.resolve(cached);
    }
  }

  async getFeaturesByType(characteristicType: CharacteristicType): Promise<FeatureListObject[]> {
    const cached = this.importSourceCache.features.get(characteristicType);
    if (cached == null || cached.length === 0) {
      return this.powerService.getFeaturesByCharacteristicType(characteristicType).then((features: FeatureListObject[]) => {
        this.importSourceCache.features.set(characteristicType, features);
        return features;
      });
    } else {
      return Promise.resolve(cached);
    }
  }

  getAllItems(): ListObject[] {
    let list: ListObject[] = [];
    this.importSourceCache.items.forEach((items: ListObject[]) => {
      list = list.concat(items);
    });
    return list;
  }

  getItems(itemType: ItemType): ListObject[] {
    return this.importSourceCache.items.get(itemType);
  }

  getItemsByType(itemType: ItemType): Promise<ListObject[]> {
    const cached = this.importSourceCache.items.get(itemType);
    if (cached == null || cached.length === 0) {
      return this.itemService.getItemsByItemType(itemType, ListSource.MY_STUFF).then((attributes: ListObject[]) => {
        this.importSourceCache.items.set(itemType, attributes);
        return attributes;
      });
    } else {
      return Promise.resolve(cached);
    }
  }

  getCreaturesByType(creatureType: CreatureType): Promise<ListObject[]> {
    const cached = this.importSourceCache.creatures.get(creatureType);
    if (cached == null || cached.length === 0) {
      return this.creatureService.getCreaturesByCreatureType(creatureType, ListSource.MY_STUFF).then((attributes: ListObject[]) => {
        this.importSourceCache.creatures.set(creatureType, attributes);
        return attributes;
      });
    } else {
      return Promise.resolve(cached);
    }
  }

  getCreatures(creatureType: CreatureType): ListObject[] {
    return this.importSourceCache.creatures.get(creatureType);
  }

  async deleteCreature(creatureType: CreatureType, creatureId: string): Promise<any> {
    const creatures: ListObject[] = await this.getCreaturesByType(creatureType);
    if (creatures != null) {
      const index = _.findIndex(creatures, (creature: ListObject) => { return creature.id === creatureId; });
      if (index > -1) {
        creatures.splice(index);
      }
      this.importSourceCache.creatures.set(creatureType, creatures);
    }
  }

  getMonsters(): Promise<ListObject[]> {
    const cached = this.importSourceCache.monsters;
    if (cached == null || cached.length === 0) {
      return this.monsterService.getMonsters(ListSource.MY_STUFF).then((monsters: ListObject[]) => {
        this.importSourceCache.monsters = monsters;
        return monsters;
      });
    } else {
      return Promise.resolve(cached);
    }
  }

  getCachedMonsters(): ListObject[] {
    return this.importSourceCache.monsters;
  }

  async deleteMonster(monsterId: string): Promise<any> {
    const monsters: ListObject[] = await this.getMonsters();
    if (monsters != null) {
      const index = _.findIndex(monsters, (monster: ListObject) => { return monster.id === monsterId; });
      if (index > -1) {
        monsters.splice(index);
      }
      this.importSourceCache.monsters = monsters;
    }
  }

  resetExpandedCache(): void {
    const importExpandedCache = new ImportCategoryExpandedSource();
    localStorage.setItem(LOCAL_STORAGE.IMPORTS_CATEGORY_EXPANDED, JSON.stringify(importExpandedCache));
  }

  private getExpandedCache(): ImportCategoryExpandedSource {
    const value = localStorage.getItem(LOCAL_STORAGE.IMPORTS_CATEGORY_EXPANDED);
    if (value == null) {
      const expandedCache = new ImportCategoryExpandedSource();
      localStorage.setItem(LOCAL_STORAGE.IMPORTS_CATEGORY_EXPANDED, JSON.stringify(expandedCache));
      return expandedCache;
    } else {
      return JSON.parse(value) as ImportCategoryExpandedSource;
    }
  }

  updateExpanded(expanded: boolean, category: ImportItemCategory): void {
    const cache = this.getExpandedCache();
    switch (category) {
      case 'ArmorType':
        cache.armorType = expanded;
        break;
      case 'DamageType':
        cache.damageType = expanded;
        break;
      case 'AreaOfEffect':
        cache.areaOfEffect = expanded;
        break;
      case 'CasterType':
        cache.casterType = expanded;
        break;
      case 'Condition':
        cache.condition = expanded;
        break;
      case 'Language':
        cache.language = expanded;
        break;
      case 'Skill':
        cache.skill = expanded;
        break;
      case 'WeaponProperty':
        cache.weaponProperty = expanded;
        break;
      case 'Background':
        cache.background = expanded;
        break;
      case 'CharacterClass':
        cache.characterClass = expanded;
        break;
      case 'Race':
        cache.race = expanded;
        break;
      case 'Feature':
        cache.feature = expanded;
        break;
      case 'Spell':
        cache.spell = expanded;
        break;
      case 'Equipment':
        cache.equipment = expanded;
        break;
      case 'Pack':
        cache.pack = expanded;
        break;
      case 'Character':
        cache.character = expanded;
        break;
      case 'Monster':
        cache.monster = expanded;
        break;
    }
    localStorage.setItem(LOCAL_STORAGE.IMPORTS_CATEGORY_EXPANDED, JSON.stringify(cache));
  }

  isCategoryExpanded(category: ImportItemCategory): boolean {
    const cache = this.getExpandedCache();
    switch (category) {
      case 'ArmorType':
        return cache.armorType;
      case 'DamageType':
        return cache.damageType;
      case 'AreaOfEffect':
        return cache.areaOfEffect;
      case 'CasterType':
        return cache.casterType;
      case 'Condition':
        return cache.condition;
      case 'Language':
        return cache.language;
      case 'Skill':
        return cache.skill;
      case 'WeaponProperty':
        return cache.weaponProperty;
      case 'Background':
        return cache.background;
      case 'CharacterClass':
        return cache.characterClass;
      case 'Race':
        return cache.race;
      case 'Feature':
        return cache.feature;
      case 'Spell':
        return cache.spell;
      case 'Equipment':
        return cache.equipment;
      case 'Pack':
        return cache.pack;
      case 'Character':
        return cache.character;
      case 'Monster':
        return cache.monster;
    }
  }
}
