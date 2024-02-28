import {Injectable} from '@angular/core';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {CasterType} from '../../../shared/models/attributes/caster-type';
import {ListObject} from '../../../shared/models/list-object';
import {AttributeService} from './attribute.service';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class CasterTypeService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private casterTypes: ListObject[] = [];
  private publicCasterTypes: ListObject[] = [];
  private privateCasterTypes: ListObject[] = [];

  constructor(
    private attributeService: AttributeService
  ) { }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.casterTypes = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicCasterTypes = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateCasterTypes = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.casterTypes;
      case ListSource.PUBLIC_CONTENT:
        return this.publicCasterTypes;
      case ListSource.PRIVATE_CONTENT:
        return this.privateCasterTypes;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.casterTypes = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicCasterTypes = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateCasterTypes = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.updateItems(id, listSource);
  }

  private updateItems(id: string, listSource: ListSource): void {
    this.resetCache(listSource);
    this.getCasterTypes(listSource).then((casterTypes: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      casterTypes.forEach((casterType: ListObject) => {
        menuItems.push(new MenuItem(casterType.id, casterType.name, '', '', false));
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

  createCasterType(casterType: CasterType): Promise<string> {
    casterType.attributeType = AttributeType.CASTER_TYPE;
    return this.attributeService.createAttribute(casterType);
  }

  getCasterTypes(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    }
    return this.attributeService.getCasterTypes(listSource).then((casterTypes: ListObject[]) => {
      this.updateCache(casterTypes, listSource);
      return casterTypes;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getCasterTypes(listSource);
  }

  getCasterType(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateCasterType(casterType: CasterType): Promise<any> {
    return this.attributeService.updateAttribute(casterType);
  }

  deleteCasterType(casterType: CasterType): Promise<any> {
    return this.attributeService.deleteAttribute(casterType);
  }

  duplicateCasterType(casterType: CasterType, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(casterType, name);
  }
}
