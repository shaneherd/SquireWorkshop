import {Injectable} from '@angular/core';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {ListObject} from '../../../shared/models/list-object';
import {ToolCategory} from '../../../shared/models/attributes/tool-category';
import {AttributeService} from './attribute.service';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class ToolCategoryService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private toolCategories: ListObject[] = [];
  private publicToolCategories: ListObject[] = [];
  private privateToolCategories: ListObject[] = [];

  constructor(
    private attributeService: AttributeService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.toolCategories = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicToolCategories = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateToolCategories = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.toolCategories;
      case ListSource.PUBLIC_CONTENT:
        return this.publicToolCategories;
      case ListSource.PRIVATE_CONTENT:
        return this.privateToolCategories;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.toolCategories = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicToolCategories = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateToolCategories = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getToolCategories(listSource).then((toolCategories: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      toolCategories.forEach((toolCategory: ListObject) => {
        menuItems.push(new MenuItem(toolCategory.id, toolCategory.name, '', '', false));
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

  createToolCategory(toolCategory: ToolCategory): Promise<string> {
    toolCategory.attributeType = AttributeType.TOOL_CATEGORY;
    return this.attributeService.createAttribute(toolCategory);
  }

  getToolCategories(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    }
    return this.attributeService.getToolCategories(listSource).then((toolCategories: ListObject[]) => {
      this.updateCache(toolCategories, listSource);
      return toolCategories;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getToolCategories(listSource);
  }

  getToolCategory(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateToolCategory(toolCategory: ToolCategory): Promise<any> {
    return this.attributeService.updateAttribute(toolCategory);
  }

  deleteToolCategory(toolCategory: ToolCategory): Promise<any> {
    return this.attributeService.deleteAttribute(toolCategory);
  }

  duplicateToolCategory(toolCategory: ToolCategory, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(toolCategory, name);
  }
}
