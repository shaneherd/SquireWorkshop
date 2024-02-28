import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ListObject} from '../../../shared/models/list-object';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {Item} from '../../../shared/models/items/item';
import {SID} from '../../../constants';
import {ItemType} from '../../../shared/models/items/item-type.enum';
import {Filters} from '../../components/filters/filters';
import {DamageConfigurationCollection} from '../../../shared/models/damage-configuration-collection';
import * as _ from 'lodash';
import {AttackType} from '../../../shared/models/attack-type.enum';
import {Weapon} from '../../../shared/models/items/weapon';
import {WeaponRangeType} from '../../../shared/models/items/weapon-range-type.enum';
import {Ammo} from '../../../shared/models/items/ammo';
import {AbilityService} from '../attributes/ability.service';
import {DamageConfiguration} from '../../../shared/models/damage-configuration';
import {Ability} from '../../../shared/models/attributes/ability.model';
import {CreatureItem} from '../../../shared/models/creatures/creature-item';
import {ItemListObject} from '../../../shared/models/items/item-list-object';
import {ItemListResponse} from '../../../shared/models/items/item-list-response';
import {InUse} from '../../../shared/models/inUse/in-use';
import {InUseService} from '../../../dashboard/view-edit/view-edit.component';
import {DiceSize} from '../../../shared/models/dice-size.enum';
import {MagicalItem} from '../../../shared/models/items/magical-item';
import {MagicalItemType} from '../../../shared/models/items/magical-item-type.enum';
import {environment} from '../../../../environments/environment';
import {ListSource} from '../../../shared/models/list-source.enum';
import {PublishRequest} from '../../../shared/models/publish-request';
import {PublishDetails} from '../../../shared/models/publish-details';
import {VersionInfo} from '../../../shared/models/version-info';
import {ManageService} from '../../../shared/components/manage-list/manage-list.component';

class ItemByTypeCollection {
  ARMOR = new Map<ListObject, ItemListObject[]>();
  WEAPON = new Map<ListObject, ItemListObject[]>();
  TOOL = new Map<ListObject, ItemListObject[]>();
  AMMO = new Map<ListObject, ItemListObject[]>();
}

@Injectable({
  providedIn: 'root'
})
export class ItemService implements MenuService, InUseService, ManageService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private itemsByType = new ItemByTypeCollection();
  private publicItemsByType = new ItemByTypeCollection();
  private privateItemsByType = new ItemByTypeCollection();

  constructor(
    private http: HttpClient,
    private abilityService: AbilityService
  ) {
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.updateMenuItemsWithFilters(id, listSource, filters);
  }

  updateMenuItemsWithFilters(id: string, listSource: ListSource, filters: Filters): void {
    if (filters == null) {
      this.clearItemsByType(listSource);
    }
    this.getItemsWithFilters(filters, 0, listSource).then((response: ItemListResponse) => {
      const menuItems: MenuItem[] = [];
      response.items.forEach((item: ItemListObject) => {
        menuItems.push(new MenuItem(item.id, item.name, '', '', false));
      });
      this.items = menuItems;

      if (id != null) {
        for (let i = 0; i < this.items.length; i++) {
          const menuItem = this.items[i];
          menuItem.selected = menuItem.id === id;
        }
      }
      this.menuItems.next(this.items);
    });
  }

  private clearItemsByType(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.itemsByType.ARMOR = new Map<ListObject, ItemListObject[]>();
        this.itemsByType.WEAPON = new Map<ListObject, ItemListObject[]>();
        this.itemsByType.TOOL = new Map<ListObject, ItemListObject[]>();
        this.itemsByType.AMMO = new Map<ListObject, ItemListObject[]>();
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicItemsByType.ARMOR = new Map<ListObject, ItemListObject[]>();
        this.publicItemsByType.WEAPON = new Map<ListObject, ItemListObject[]>();
        this.publicItemsByType.TOOL = new Map<ListObject, ItemListObject[]>();
        this.publicItemsByType.AMMO = new Map<ListObject, ItemListObject[]>();
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateItemsByType.ARMOR = new Map<ListObject, ItemListObject[]>();
        this.privateItemsByType.WEAPON = new Map<ListObject, ItemListObject[]>();
        this.privateItemsByType.TOOL = new Map<ListObject, ItemListObject[]>();
        this.privateItemsByType.AMMO = new Map<ListObject, ItemListObject[]>();
        break;
    }
  }

  createItem(item: Item): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(environment.backendUrl + '/items/', item, options).toPromise();
  }

  getPublishDetails(item: Item): Promise<PublishDetails> {
    return this.http.get<PublishDetails>(`${environment.backendUrl}/items/${item.id}/published`).toPromise();
  }

  getVersionInfo(itemId: string): Promise<VersionInfo> {
    return this.http.get<VersionInfo>(`${environment.backendUrl}/items/${itemId}/version`).toPromise();
  }

  publishItem(item: Item, publishRequest: PublishRequest): Promise<any> {
    return this.publish(item.id, publishRequest);
  }

  publish(id: string, publishRequest: PublishRequest): Promise<any> {
    return this.http.put<any>(`${environment.backendUrl}/items/${id}`, publishRequest).toPromise();
  }

  addToMyStuff(item: Item): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(`${environment.backendUrl}/items/${item.id}/myStuff`, item, options).toPromise();
  }

  getItems(offset = 0, listSource: ListSource = ListSource.MY_STUFF): Promise<ItemListResponse> {
    return this.http.get<ItemListResponse>(`${environment.backendUrl}/items?offset=${offset}&source=${listSource}`).toPromise();
  }

  getItemsWithFilters(filters: Filters, offset: number, listSource: ListSource = ListSource.MY_STUFF): Promise<ItemListResponse> {
    if (filters == null) {
      filters = new Filters();
    }
    return this.http.post<ItemListResponse>(`${environment.backendUrl}/items?offset=${offset}&source=${listSource}`, filters).toPromise();
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    // if (clearCache) {
    //   this.resetCache(listSource);
    // }
    return this.getItemsWithFilters(filters, 0, listSource).then((response: ItemListResponse) => {
      return response.items;
    });
  }

  getItemsByTypeAndSubType(itemType: ItemType, subType: ListObject, listSource: ListSource): Promise<ItemListObject[]> {
    const map: Map<ListObject, ItemListObject[]> = this.itemsByType[itemType];
    const list = map.get(subType);
    if (list != null && list.length > 0) {
      return Promise.resolve(list);
    }

    return this.http.get<ItemListObject[]>(`${environment.backendUrl}/items/type/${itemType}/subType/${subType.id}?source=${listSource}`)
      .toPromise().then((items: ItemListObject[]) => {
        map.set(subType, items);
        return items;
      });
  }

  getArmors(listSource: ListSource = ListSource.MY_STUFF): Promise<ItemListObject[]> {
    return this.getItemsByItemType(ItemType.ARMOR, listSource);
  }

  getArmorsByArmorType(armorType: ListObject, listSource: ListSource = ListSource.MY_STUFF): Promise<ItemListObject[]> {
    return this.getItemsByTypeAndSubType(ItemType.ARMOR, armorType, listSource);
  }

  getWeapons(listSource: ListSource = ListSource.MY_STUFF): Promise<ItemListObject[]> {
    return this.getItemsByItemType(ItemType.WEAPON, listSource);
  }

  getWeaponsByWeaponType(weaponType: ListObject, listSource: ListSource = ListSource.MY_STUFF): Promise<ItemListObject[]> {
    return this.getItemsByTypeAndSubType(ItemType.WEAPON, weaponType, listSource);
  }

  getTools(listSource: ListSource = ListSource.MY_STUFF): Promise<ItemListObject[]> {
    return this.getItemsByItemType(ItemType.TOOL, listSource);
  }

  getToolsByToolCategory(toolCategory: ListObject, listSource: ListSource = ListSource.MY_STUFF): Promise<ItemListObject[]> {
    return this.getItemsByTypeAndSubType(ItemType.TOOL, toolCategory, listSource);
  }

  getAmmos(listSource: ListSource = ListSource.MY_STUFF): Promise<ItemListObject[]> {
    return this.getItemsByItemType(ItemType.AMMO, listSource);
  }

  getItemsByItemType(itemType: ItemType, listSource: ListSource): Promise<ItemListObject[]> {
    return this.http.get<ItemListResponse>(`${environment.backendUrl}/items/type/${itemType}?source=${listSource}`).toPromise().then((response: ItemListResponse) => {
      return response.items;
    });
  }

  getItem(id: string): Promise<Item> {
    return this.http.get<Item>(environment.backendUrl + '/items/' + id).toPromise();
  }

  updateItem(item: Item): Promise<any> {
    return this.http.post<any>(environment.backendUrl + '/items/' + item.id, item).toPromise();
  }

  inUse(id: string): Promise<InUse[]> {
    return this.http.get<InUse[]>(`${environment.backendUrl}/items/${id}/in-use`).toPromise();
  }

  delete(id: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/items/${id}`).toPromise();
  }

  deleteItem(item: Item): Promise<any> {
    return this.delete(item.id);
  }

  duplicateItem(item: Item, name: string): Promise<string> {
    const body = new URLSearchParams();
    body.set('name', name);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(environment.backendUrl + '/items/' + item.id + '/duplicate', body.toString(), options).toPromise();
  }

  initializeDamageConfigurations(item: Item, creatureItem: CreatureItem, versatile: boolean): DamageConfigurationCollection {
    const collection = new DamageConfigurationCollection();
    collection.attackType = AttackType.ATTACK;
    this.initializeAttackMod(item, creatureItem, collection);
    if (item.itemType === ItemType.MAGICAL_ITEM && creatureItem != null) {
      const magicalItem = item as MagicalItem;
      if (creatureItem.magicalItem != null) {
        collection.damageConfigurations = this.getCollectionDamageConfigurations(creatureItem.magicalItem, versatile);
      }
      if (!magicalItem.requiresAttunement || creatureItem.attuned) {
        collection.damageConfigurations = collection.damageConfigurations.concat(this.getCollectionDamageConfigurations(item, versatile));
      }
    } else {
      collection.damageConfigurations = collection.damageConfigurations.concat(this.getCollectionDamageConfigurations(item, versatile));
    }
    return _.cloneDeep(collection);
  }

  hasWeaponProperty(weapon: Weapon, weaponProperty: number): boolean {
    for (let i = 0; i < weapon.properties.length; i++) {
      const property = weapon.properties[i];
      if (property.sid === weaponProperty) {
        return true;
      }
    }
    return false;
  }

  private initializeAttackMod(item: Item, creatureItem: CreatureItem, collection: DamageConfigurationCollection): void {
    let attackMod = 0
    let attackAbilityMod = '0';
    let attackAbilitySID = 0;
    switch (item.itemType) {
      case ItemType.WEAPON:
        //todo - handle finesse/thrown
        const weapon = item as Weapon;
        attackMod = weapon.attackMod;
        if (weapon.rangeType === WeaponRangeType.MELEE) {
          attackAbilitySID = SID.ABILITIES.STRENGTH;
        } else if (weapon.rangeType === WeaponRangeType.RANGED) {
          attackAbilitySID = SID.ABILITIES.DEXTERITY;
        }
        break;
      case ItemType.AMMO:
        const ammo = item as Ammo;
        attackMod = ammo.attackModifier;
        if (ammo.attackAbilityModifier != null) {
          attackAbilityMod = ammo.attackAbilityModifier.id;
        }
        break;
      case ItemType.MAGICAL_ITEM:
        const magicalItem = item as MagicalItem;
        if (creatureItem != null && creatureItem.magicalItem != null) {
          this.initializeAttackMod(creatureItem.magicalItem, creatureItem, collection);
        }
        if (creatureItem == null || (magicalItem.requiresAttunement && creatureItem.attuned)) {
          attackMod = collection.attackMod + magicalItem.attackMod;
        }
        attackAbilityMod = collection.attackAbilityMod;
        break;
    }

    collection.attackMod = attackMod;
    if (attackAbilityMod !== '0') {
      collection.attackAbilityMod = attackAbilityMod;
    } else if (attackAbilitySID !== 0) {
      const ability = this.abilityService.getAbilityBySid(attackAbilitySID);
      if (ability != null) {
        collection.attackAbilityMod = ability.id;
      }
    }
  }

  getCollectionDamageConfigurations(item: Item, versatile: boolean): DamageConfiguration[] {
    let configs: DamageConfiguration[] = [];
    switch (item.itemType) {
      case ItemType.WEAPON:
        const weapon = item as Weapon;
        if (versatile) {
          configs = weapon.versatileDamages;
        } else {
          configs = weapon.damages;
        }
        break;
      case ItemType.AMMO:
        const ammo = item as Ammo;
        configs = ammo.damages;
        break;
      case ItemType.MAGICAL_ITEM:
        const magicalItem = item as MagicalItem;
        if (magicalItem.magicalItemType === MagicalItemType.WEAPON || magicalItem.magicalItemType === MagicalItemType.AMMO) {
          configs = magicalItem.damages;
        } else {
          const magicalItemImprovisedDamage = new DamageConfiguration();
          magicalItemImprovisedDamage.values.numDice = 1;
          magicalItemImprovisedDamage.values.diceSize = DiceSize.FOUR;
          magicalItemImprovisedDamage.damageType = null; //todo - bludgeoning?
          configs.push(magicalItemImprovisedDamage)
        }
        break;
      default:
        //improvised weapon
        const improvisedDamage = new DamageConfiguration();
        improvisedDamage.values.numDice = 1;
        improvisedDamage.values.diceSize = DiceSize.FOUR;
        improvisedDamage.damageType = null; //todo - bludgeoning?
        configs.push(improvisedDamage)
        break;
    }

    const list = configs.slice(0);
    list.forEach((config: DamageConfiguration) => {
      if (config.values.abilityModifier == null) {
        config.values.abilityModifier = new Ability();
      }
    });
    return list;
  }

  isTwoHanded(weapon: Weapon): boolean {
    for (let i = 0; i < weapon.properties.length; i++) {
      if (weapon.properties[i].sid === SID.WEAPON_PROPERTIES.TWO_HANDED) {
        return true;
      }
    }
    return false;
  }

  isThrown(weapon: Weapon): boolean {
    for (let i = 0; i < weapon.properties.length; i++) {
      if (weapon.properties[i].sid === SID.WEAPON_PROPERTIES.THROWN) {
        return true;
      }
    }
    return false;
  }

  getScrollSpellAttackModifier(spellLevel: number): number {
    switch (spellLevel) {
      case 0:
      case 1:
      case 2:
        return 5;
      case 3:
      case 4:
        return 7;
      case 5:
      case 6:
        return 9;
      case 7:
      case 8:
        return 10;
      case 9:
        return 11;
    }
  }

  getScrollSpellSaveDC(spellLevel: number): number {
    return 8 + this.getScrollSpellAttackModifier(spellLevel);
  }
}
