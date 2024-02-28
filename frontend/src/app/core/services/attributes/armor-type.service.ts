import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ArmorType} from '../../../shared/models/attributes/armor-type';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {ListObject} from '../../../shared/models/list-object';
import {AttributeService} from './attribute.service';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class ArmorTypeService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private armorTypes: ListObject[] = [];
  private publicArmorTypes: ListObject[] = [];
  private privateArmorTypes: ListObject[] = [];

  constructor(
    private attributeService: AttributeService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.armorTypes = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicArmorTypes = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateArmorTypes = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.armorTypes;
      case ListSource.PUBLIC_CONTENT:
        return this.publicArmorTypes;
      case ListSource.PRIVATE_CONTENT:
        return this.privateArmorTypes;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.armorTypes = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicArmorTypes = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateArmorTypes = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getArmorTypes(listSource).then((armorTypes: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      armorTypes.forEach((armorType: ListObject) => {
        menuItems.push(new MenuItem(armorType.id, armorType.name, '', '', false));
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

  createArmorType(armorType: ArmorType): Promise<string> {
    armorType.attributeType = AttributeType.ARMOR_TYPE;
    return this.attributeService.createAttribute(armorType);
  }

  getArmorTypes(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache);
    } else {
      return this.attributeService.getArmorTypes(listSource).then((armorTypes: ListObject[]) => {
        this.updateCache(armorTypes, listSource);
        return armorTypes;
      });
    }
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getArmorTypes(listSource);
  }

  getArmorType(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateArmorType(armorType: ArmorType): Promise<any> {
    return this.attributeService.updateAttribute(armorType);
  }

  deleteArmorType(armorType: ArmorType): Promise<any> {
    return this.attributeService.deleteAttribute(armorType);
  }

  duplicateArmorType(armorType: ArmorType, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(armorType, name);
  }
}
