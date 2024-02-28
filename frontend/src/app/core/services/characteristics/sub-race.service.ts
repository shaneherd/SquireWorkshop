import { Injectable } from '@angular/core';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {ListObject} from '../../../shared/models/list-object';
import {BehaviorSubject} from 'rxjs';
import {CharacteristicService} from './characteristic.service';
import {Filters} from '../../components/filters/filters';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {Race} from '../../../shared/models/characteristics/race';
import {CharacterClass} from '../../../shared/models/characteristics/character-class';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class SubRaceService implements MenuService {
  private items: MenuItem[] = [];
  private parentRace: Race = null;
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  parent: BehaviorSubject<Race> = new BehaviorSubject<Race>(null);

  constructor(
    private characteristicService: CharacteristicService
  ) { }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
  }

  getSubRaces(parentId: string): Promise<ListObject[]> {
    return this.characteristicService.getChildrenCharacteristics(parentId).then((subRaces: ListObject[]) => {
      return subRaces;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    // if (clearCache) {
    //   this.resetCache(listSource);
    // }
    return Promise.resolve([]);
  }

  getParent(parentId: string): Promise<Race> {
    if (this.parentRace != null) {
      return Promise.resolve(this.parentRace);
    }
    return this.characteristicService.getCharacteristic(parentId).then((parent: Characteristic) => {
      this.updateParentRace(parent as Race);
      return this.parentRace;
    });
  }

  updateParentRace(race: Race): void {
    this.parentRace = race;
    const menuItems: MenuItem[] = [];
    if (race != null) {
      race.subRaces.forEach((subRace: Race) => {
        menuItems.push(new MenuItem(subRace.id, subRace.name, '', '', false));
      });
    }
    this.items = menuItems;
    this.menuItems.next(menuItems);
    this.parent.next(this.parentRace);
  }
}
