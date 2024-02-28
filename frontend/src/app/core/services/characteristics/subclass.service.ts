import { Injectable } from '@angular/core';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {BehaviorSubject} from 'rxjs';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {Filters} from '../../components/filters/filters';
import {CharacterClass} from '../../../shared/models/characteristics/character-class';
import {ListObject} from '../../../shared/models/list-object';
import {CharacteristicService} from './characteristic.service';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class SubclassService implements MenuService {
  private items: MenuItem[] = [];
  private subclasses: ListObject[] = [];
  private parentClass: CharacterClass = null;
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  parent: BehaviorSubject<CharacterClass> = new BehaviorSubject<CharacterClass>(null);

  constructor(
    private characteristicService: CharacteristicService
  ) { }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
  }

  getSubclasses(parentId: string): Promise<ListObject[]> {
    if (this.subclasses.length > 0) {
      return Promise.resolve(this.subclasses);
    }
    return this.characteristicService.getChildrenCharacteristics(parentId).then((subclasses: ListObject[]) => {
      this.subclasses = subclasses;
      return subclasses;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    // if (clearCache) {
    //   this.resetCache(listSource);
    // }
    return Promise.resolve([]);
  }

  getParent(parentId: string): Promise<CharacterClass> {
    if (this.parentClass != null) {
      return Promise.resolve(this.parentClass);
    }
    return this.characteristicService.getCharacteristic(parentId).then((parent: Characteristic) => {
      this.updateParentClass(parent as CharacterClass);
      return this.parentClass;
    });
  }

  updateParentClass(characterClass: CharacterClass): void {
    this.parentClass = characterClass;
    const menuItems: MenuItem[] = [];
    if (characterClass != null) {
      characterClass.subclasses.forEach((subclass: CharacterClass) => {
        menuItems.push(new MenuItem(subclass.id, subclass.name, '', '', false));
      });
    }
    this.items = menuItems;
    this.menuItems.next(menuItems);
    this.parent.next(this.parentClass);
  }
}
