import {Injectable} from '@angular/core';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {ListObject} from '../../../shared/models/list-object';
import {AttributeService} from './attribute.service';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {SpellSchool} from '../../../shared/models/attributes/spell-school';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class SpellSchoolService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private spellSchools: ListObject[] = [];
  private publicSpellSchools: ListObject[] = [];
  private privateSpellSchools: ListObject[] = [];

  constructor(
    private attributeService: AttributeService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.spellSchools = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicSpellSchools = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateSpellSchools = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.spellSchools;
      case ListSource.PUBLIC_CONTENT:
        return this.publicSpellSchools;
      case ListSource.PRIVATE_CONTENT:
        return this.privateSpellSchools;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.spellSchools = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicSpellSchools = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateSpellSchools = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getSpellSchools(listSource).then((spellSchools: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      spellSchools.forEach((spellSchool: ListObject) => {
        menuItems.push(new MenuItem(spellSchool.id, spellSchool.name, '', '', false));
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

  createSpellSchool(spellSchool: SpellSchool): Promise<string> {
    spellSchool.attributeType = AttributeType.SPELL_SCHOOL;
    return this.attributeService.createAttribute(spellSchool);
  }

  getSpellSchools(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    } else {
      return this.attributeService.getSpellSchools(listSource).then((spellSchools: ListObject[]) => {
        this.updateCache(spellSchools, listSource);
        return spellSchools;
      });
    }
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getSpellSchools(listSource);
  }

  getSpellSchool(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateSpellSchool(spellSchool: SpellSchool): Promise<any> {
    return this.attributeService.updateAttribute(spellSchool);
  }

  deleteSpellSchool(spellSchool: SpellSchool): Promise<any> {
    return this.attributeService.deleteAttribute(spellSchool);
  }

  duplicateSpellSchool(spellSchool: SpellSchool, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(spellSchool, name);
  }
}
