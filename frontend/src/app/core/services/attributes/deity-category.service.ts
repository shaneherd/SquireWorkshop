import {Injectable} from '@angular/core';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {ListObject} from '../../../shared/models/list-object';
import {AttributeService} from './attribute.service';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {DeityCategory} from '../../../shared/models/attributes/deity-category';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class DeityCategoryService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private deityCategories: ListObject[] = [];
  private publicDeityCategories: ListObject[] = [];
  private privateDeityCategories: ListObject[] = [];

  constructor(
    private attributeService: AttributeService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.deityCategories = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicDeityCategories = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateDeityCategories = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.deityCategories;
      case ListSource.PUBLIC_CONTENT:
        return this.publicDeityCategories;
      case ListSource.PRIVATE_CONTENT:
        return this.privateDeityCategories;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.deityCategories = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicDeityCategories = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateDeityCategories = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getDeityCategories(listSource).then((deityCategories: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      deityCategories.forEach((deityCategory: ListObject) => {
        menuItems.push(new MenuItem(deityCategory.id, deityCategory.name, '', '', false));
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

  createDeityCategory(deityCategory: DeityCategory): Promise<string> {
    deityCategory.attributeType = AttributeType.DEITY_CATEGORY;
    return this.attributeService.createAttribute(deityCategory);
  }

  getDeityCategories(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    } else {
      return this.attributeService.getDeityCategories(listSource).then((deityCategories: ListObject[]) => {
        this.updateCache(deityCategories, listSource);
        return deityCategories;
      });
    }
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getDeityCategories(listSource);
  }

  getDeityCategory(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateDeityCategory(deityCategory: DeityCategory): Promise<any> {
    return this.attributeService.updateAttribute(deityCategory);
  }

  deleteDeityCategory(deityCategory: DeityCategory): Promise<any> {
    return this.attributeService.deleteAttribute(deityCategory);
  }

  duplicateDeityCategory(deityCategory: DeityCategory, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(deityCategory, name);
  }
}
