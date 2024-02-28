import {Injectable} from '@angular/core';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {DamageType} from '../../../shared/models/attributes/damage-type';
import {AttributeService} from './attribute.service';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {ListObject} from '../../../shared/models/list-object';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class DamageTypeService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private damageTypes: ListObject[] = [];
  private publicDamageTypes: ListObject[] = [];
  private privateDamageTypes: ListObject[] = [];

  constructor(
    private attributeService: AttributeService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.damageTypes = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicDamageTypes = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateDamageTypes = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.damageTypes;
      case ListSource.PUBLIC_CONTENT:
        return this.publicDamageTypes;
      case ListSource.PRIVATE_CONTENT:
        return this.privateDamageTypes;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.damageTypes = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicDamageTypes = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateDamageTypes = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getDamageTypes(listSource).then((damageTypes: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      damageTypes.forEach((damageType: ListObject) => {
        menuItems.push(new MenuItem(damageType.id, damageType.name, '', '', false));
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

  createDamageType(damageType: DamageType): Promise<string> {
    damageType.attributeType = AttributeType.DAMAGE_TYPE;
    return this.attributeService.createAttribute(damageType);
  }

  getDamageTypes(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    }
    return this.attributeService.getDamageTypes(listSource).then((damageTypes: ListObject[]) => {
      this.updateCache(damageTypes, listSource);
      return damageTypes;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getDamageTypes(listSource);
  }

  getDamageType(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateDamageType(damageType: DamageType): Promise<any> {
    return this.attributeService.updateAttribute(damageType);
  }

  deleteDamageType(damageType: DamageType): Promise<any> {
    return this.attributeService.deleteAttribute(damageType);
  }

  duplicateDamageType(damageType: DamageType, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(damageType, name);
  }
}
