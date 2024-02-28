import {Injectable} from '@angular/core';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {ListObject} from '../../../shared/models/list-object';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {WeaponType} from '../../../shared/models/items/weapon-type';
import {AttributeService} from './attribute.service';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class WeaponTypeService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private weaponTypes: ListObject[] = [];
  private publicWeaponTypes: ListObject[] = [];
  private privateWeaponTypes: ListObject[] = [];

  constructor(
    private attributeService: AttributeService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.weaponTypes = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicWeaponTypes = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateWeaponTypes = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.weaponTypes;
      case ListSource.PUBLIC_CONTENT:
        return this.publicWeaponTypes;
      case ListSource.PRIVATE_CONTENT:
        return this.privateWeaponTypes;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.weaponTypes = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicWeaponTypes = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateWeaponTypes = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getWeaponTypes(listSource).then((weaponTypes: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      weaponTypes.forEach((weaponType: ListObject) => {
        menuItems.push(new MenuItem(weaponType.id, weaponType.name, '', '', false));
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

  createWeaponType(weaponType: WeaponType): Promise<string> {
    weaponType.attributeType = AttributeType.WEAPON_TYPE;
    return this.attributeService.createAttribute(weaponType);
  }

  getWeaponTypes(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    }
    return this.attributeService.getWeaponTypes(listSource).then((weaponTypes: ListObject[]) => {
      this.updateCache(weaponTypes, listSource);
      return weaponTypes;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getWeaponTypes(listSource);
  }

  getWeaponType(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateWeaponType(weaponType: WeaponType): Promise<any> {
    return this.attributeService.updateAttribute(weaponType);
  }

  deleteWeaponType(weaponType: WeaponType): Promise<any> {
    return this.attributeService.deleteAttribute(weaponType);
  }

  duplicateWeaponType(weaponType: WeaponType, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(weaponType, name);
  }
}
