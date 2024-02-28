import {Injectable} from '@angular/core';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {WeaponProperty} from '../../../shared/models/attributes/weapon-property';
import {AttributeService} from './attribute.service';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {ListObject} from '../../../shared/models/list-object';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class WeaponPropertyService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private weaponProperties: ListObject[] = [];
  private publicWeaponProperties: ListObject[] = [];
  private privateWeaponProperties: ListObject[] = [];

  constructor(
    private attributeService: AttributeService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.weaponProperties = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicWeaponProperties = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateWeaponProperties = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.weaponProperties;
      case ListSource.PUBLIC_CONTENT:
        return this.publicWeaponProperties;
      case ListSource.PRIVATE_CONTENT:
        return this.privateWeaponProperties;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.weaponProperties = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicWeaponProperties = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateWeaponProperties = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getWeaponProperties(listSource).then((weaponProperties: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      weaponProperties.forEach((weaponProperty: ListObject) => {
        menuItems.push(new MenuItem(weaponProperty.id, weaponProperty.name, '', '', false));
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

  createWeaponProperty(weaponProperty: WeaponProperty): Promise<string> {
    weaponProperty.attributeType = AttributeType.WEAPON_PROPERTY;
    return this.attributeService.createAttribute(weaponProperty);
  }

  getWeaponProperties(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    }
    return this.attributeService.getWeaponProperties(listSource).then((weaponProperties: ListObject[]) => {
      this.updateCache(weaponProperties, listSource);
      return weaponProperties;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getWeaponProperties(listSource);
  }

  getWeaponProperty(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateWeaponProperty(weaponProperty: WeaponProperty): Promise<any> {
    return this.attributeService.updateAttribute(weaponProperty);
  }

  deleteWeaponProperty(weaponProperty: WeaponProperty): Promise<any> {
    return this.attributeService.deleteAttribute(weaponProperty);
  }

  duplicateWeaponProperty(weaponProperty: WeaponProperty, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(weaponProperty, name);
  }
}
