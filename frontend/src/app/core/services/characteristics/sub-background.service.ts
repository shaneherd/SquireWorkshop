import { Injectable } from '@angular/core';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {Background} from '../../../shared/models/characteristics/background';
import {BehaviorSubject} from 'rxjs';
import {CharacteristicService} from './characteristic.service';
import {Filters} from '../../components/filters/filters';
import {ListObject} from '../../../shared/models/list-object';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {ListSource} from '../../../shared/models/list-source.enum';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';

@Injectable({
  providedIn: 'root'
})
export class SubBackgroundService implements MenuService {
  private items: MenuItem[] = [];
  private parentBackground: Background = null;
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  parent: BehaviorSubject<Background> = new BehaviorSubject<Background>(null);

  constructor(
    private characteristicService: CharacteristicService
  ) { }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
  }

  getSubBackgrounds(parentId: string): Promise<ListObject[]> {
    return this.characteristicService.getChildrenCharacteristics(parentId).then((subBackgrounds: ListObject[]) => {
      return subBackgrounds;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    // if (clearCache) {
    //   this.resetCache(listSource);
    // }
    return Promise.resolve([]);
  }

  getParent(parentId: string): Promise<Background> {
    if (this.parentBackground != null) {
      return Promise.resolve(this.parentBackground);
    }
    return this.characteristicService.getCharacteristic(parentId).then((parent: Characteristic) => {
      this.updateParentBackground(parent as Background);
      return this.parentBackground;
    });
  }

  updateParentBackground(background: Background): void {
    this.parentBackground = background;
    const menuItems: MenuItem[] = [];
    if (background != null) {
      background.subBackgrounds.forEach((subBackground: Background) => {
        menuItems.push(new MenuItem(subBackground.id, subBackground.name, '', '', false));
      });
    }
    this.items = menuItems;
    this.menuItems.next(menuItems);
    this.parent.next(this.parentBackground);
  }
}
