import {Injectable} from '@angular/core';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {ListObject} from '../../../shared/models/list-object';
import {AttributeService} from './attribute.service';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {AreaOfEffect} from '../../../shared/models/attributes/area-of-effect';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class AreaOfEffectService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private areaOfEffects: ListObject[] = [];
  private publicAreaOfEffects: ListObject[] = [];
  private privateAreaOfEffects: ListObject[] = [];

  constructor(
    private attributeService: AttributeService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.areaOfEffects = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicAreaOfEffects = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateAreaOfEffects = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.areaOfEffects;
      case ListSource.PUBLIC_CONTENT:
        return this.publicAreaOfEffects;
      case ListSource.PRIVATE_CONTENT:
        return this.privateAreaOfEffects;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.areaOfEffects = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicAreaOfEffects = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateAreaOfEffects = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getAreaOfEffects(listSource).then((areaOfEffects: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      areaOfEffects.forEach((areaOfEffect: ListObject) => {
        menuItems.push(new MenuItem(areaOfEffect.id, areaOfEffect.name, '', '', false));
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

  createAreaOfEffect(areaOfEffect: AreaOfEffect): Promise<string> {
    areaOfEffect.attributeType = AttributeType.AREA_OF_EFFECT;
    return this.attributeService.createAttribute(areaOfEffect);
  }

  getAreaOfEffects(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    } else {
      return this.attributeService.getAreaOfEffects(listSource).then((areaOfEffects: ListObject[]) => {
        this.updateCache(areaOfEffects, listSource);
        return areaOfEffects;
      });
    }
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getAreaOfEffects(listSource);
  }

  getAreaOfEffect(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateAreaOfEffect(areaOfEffect: AreaOfEffect): Promise<any> {
    return this.attributeService.updateAttribute(areaOfEffect);
  }

  deleteAreaOfEffect(areaOfEffect: AreaOfEffect): Promise<any> {
    return this.attributeService.deleteAttribute(areaOfEffect);
  }

  duplicateAreaOfEffect(areaOfEffect: AreaOfEffect, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(areaOfEffect, name);
  }
}
