import {Injectable} from '@angular/core';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {ListObject} from '../../../shared/models/list-object';
import {AttributeService} from './attribute.service';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {Alignment} from '../../../shared/models/attributes/alignment';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class AlignmentService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private alignments: ListObject[] = [];
  private publicAlignments: ListObject[] = [];
  private privateAlignments: ListObject[] = [];

  constructor(
    private attributeService: AttributeService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.alignments = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicAlignments = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateAlignments = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.alignments;
      case ListSource.PUBLIC_CONTENT:
        return this.publicAlignments;
      case ListSource.PRIVATE_CONTENT:
        return this.privateAlignments;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.alignments = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicAlignments = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateAlignments = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getAlignments(listSource).then((alignments: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      alignments.forEach((alignment: ListObject) => {
        menuItems.push(new MenuItem(alignment.id, alignment.name, '', '', false));
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

  createAlignment(alignment: Alignment): Promise<string> {
    alignment.attributeType = AttributeType.ALIGNMENT;
    return this.attributeService.createAttribute(alignment);
  }

  getAlignments(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    } else {
      return this.attributeService.getAlignments(listSource).then((alignments: ListObject[]) => {
        this.updateCache(alignments, listSource);
        return alignments.slice();
      });
    }
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getAlignments(listSource);
  }

  getAlignment(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateAlignment(alignment: Alignment): Promise<any> {
    return this.attributeService.updateAttribute(alignment);
  }

  deleteAlignment(alignment: Alignment): Promise<any> {
    return this.attributeService.deleteAttribute(alignment);
  }

  duplicateAlignment(alignment: Alignment, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(alignment, name);
  }
}
