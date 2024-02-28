import { Injectable } from '@angular/core';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {ListObject} from '../../../shared/models/list-object';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {Race} from '../../../shared/models/characteristics/race';
import {CharacteristicService} from './characteristic.service';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class RaceService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private races: ListObject[] = [];
  private publicRaces: ListObject[] = [];
  private privateRaces: ListObject[] = [];
  private allRaces: ListObject[] = [];

  constructor(
    private characteristicService: CharacteristicService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.races = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicRaces = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateRaces = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.races;
      case ListSource.PUBLIC_CONTENT:
        return this.publicRaces;
      case ListSource.PRIVATE_CONTENT:
        return this.privateRaces;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.races = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicRaces = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateRaces = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getRaces(false, false, listSource).then((races: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      races.forEach((race: ListObject) => {
        menuItems.push(new MenuItem(race.id, race.name, '', '', false));
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

  createRace(race: Race): Promise<string> {
    race.characteristicType = CharacteristicType.RACE;
    return this.characteristicService.createCharacteristic(race);
  }

  getRaces(includeChildren: boolean = false, authorOnly: boolean = false, listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    if (includeChildren && this.allRaces.length > 0) {
      return Promise.resolve(this.allRaces);
    } else if (!includeChildren) {
      const cache = this.getCached(listSource);
      if (cache.length > 0) {
        return Promise.resolve(cache.slice());
      }
    }
    return this.characteristicService.getRaces(includeChildren, authorOnly, listSource).then((races: ListObject[]) => {
      if (includeChildren) {
        this.allRaces = races;
      } else {
        this.updateCache(races, listSource);
      }
      return races;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getRaces(false, false, listSource);
  }

  getRace(id: string): Promise<Characteristic> {
    return this.characteristicService.getCharacteristic(id);
  }

  updateRace(race: Race): Promise<any> {
    return this.characteristicService.updateCharacteristic(race);
  }

  deleteRace(race: Race): Promise<any> {
    return this.characteristicService.deleteCharacteristic(race);
  }

  duplicateRace(race: Race, name: string): Promise<string> {
    return this.characteristicService.duplicateCharacteristic(race, name);
  }
}
