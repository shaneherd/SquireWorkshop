import {Injectable} from '@angular/core';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {ListObject} from '../../../shared/models/list-object';
import {AttributeService} from './attribute.service';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {Deity} from '../../../shared/models/attributes/deity';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class DeityService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private deities: ListObject[] = [];
  private publicDeities: ListObject[] = [];
  private privateDeities: ListObject[] = [];

  constructor(
    private attributeService: AttributeService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.deities = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicDeities = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateDeities = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.deities;
      case ListSource.PUBLIC_CONTENT:
        return this.publicDeities;
      case ListSource.PRIVATE_CONTENT:
        return this.privateDeities;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.deities = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicDeities = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateDeities = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getDeities(listSource).then((deities: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      deities.forEach((deity: ListObject) => {
        menuItems.push(new MenuItem(deity.id, deity.name, '', '', false));
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

  createDeity(deity: Deity): Promise<string> {
    deity.attributeType = AttributeType.DEITY;
    return this.attributeService.createAttribute(deity);
  }

  getDeities(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    } else {
      return this.attributeService.getDeities(listSource).then((deities: ListObject[]) => {
        this.updateCache(deities, listSource);
        return deities;
      });
    }
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getDeities(listSource);
  }

  getDeity(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateDeity(deity: Deity): Promise<any> {
    return this.attributeService.updateAttribute(deity);
  }

  deleteDeity(deity: Deity): Promise<any> {
    return this.attributeService.deleteAttribute(deity);
  }

  duplicateDeity(deity: Deity, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(deity, name);
  }
}
