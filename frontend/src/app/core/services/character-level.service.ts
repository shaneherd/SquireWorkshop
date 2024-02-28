import { Injectable } from '@angular/core';
import {MenuService} from '../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {ListObject} from '../../shared/models/list-object';
import {AttributeService} from './attributes/attribute.service';
import {AttributeType} from '../../shared/models/attributes/attribute-type.enum';
import {Attribute} from '../../shared/models/attributes/attribute';
import {CharacterLevel} from '../../shared/models/character-level';
import {LOCAL_STORAGE} from '../../constants';
import {HttpClient} from '@angular/common/http';
import {Filters} from '../components/filters/filters';
import {environment} from '../../../environments/environment';
import {ListSource} from '../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class CharacterLevelService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private levels: ListObject[] = [];
  private publicLevels: ListObject[] = [];
  private privateLevels: ListObject[] = [];

  constructor(
    private attributeService: AttributeService,
    private http: HttpClient
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.levels = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicLevels = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateLevels = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.levels;
      case ListSource.PUBLIC_CONTENT:
        return this.publicLevels;
      case ListSource.PRIVATE_CONTENT:
        return this.privateLevels;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.levels = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicLevels = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateLevels = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getLevels(listSource).then((levels: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      levels.forEach((level: ListObject) => {
        menuItems.push(new MenuItem(level.id, level.name, '', '', false));
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

  createCharacterLevel(level: CharacterLevel): Promise<string> {
    level.attributeType = AttributeType.LEVEL;
    return this.attributeService.createAttribute(level);
  }

  getLevels(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    }
    return this.attributeService.getLevels(listSource).then((levels: ListObject[]) => {
      this.updateCache(levels, listSource);
      return levels;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getLevels(listSource);
  }

  initializeLevelsDetailed(): Promise<CharacterLevel[]> {
    const listSource = ListSource.MY_STUFF;
    return this.http.get<CharacterLevel[]>(`${environment.backendUrl}/attributes/type/${AttributeType.LEVEL}/detailed?source=${listSource}`)
      .toPromise().then((levels: CharacterLevel[]) => {
        levels.forEach((level: CharacterLevel) => {
          level.type = 'CharacterLevel';
        });
        localStorage.setItem(LOCAL_STORAGE.LEVELS, JSON.stringify(levels));
        return levels;
      });
  }

  getLevelsDetailedFromStorage(): CharacterLevel[] {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE.LEVELS));
  }

  getLevelsDetailedFromStorageAsListObject(): ListObject[] {
    const levels = this.getLevelsDetailedFromStorage();
    const list: ListObject[] = [];
    levels.forEach((level: CharacterLevel) => {
      list.push(new ListObject(level.id, level.name, level.sid));
    });
    return list;
  }

  getLevelsDetailed(): Promise<CharacterLevel[]> {
    const levelsDetailed = this.getLevelsDetailedFromStorage();
    if (levelsDetailed != null && levelsDetailed.length > 0) {
      return Promise.resolve(levelsDetailed);
    }
    return this.initializeLevelsDetailed();
  }

  getLevelByName(name: string): CharacterLevel {
    const levels: CharacterLevel[] = this.getLevelsDetailedFromStorage();
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      if (level.name === name) {
        return level;
      }
    }
    return null;
  }

  getLevelBySid(sid: number): CharacterLevel {
    const levels: CharacterLevel[] = this.getLevelsDetailedFromStorage();
    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      if (level.sid === sid) {
        return level;
      }
    }
    return null;
  }

  getLevelByExpInstant(exp: number): CharacterLevel {
    const levels: CharacterLevel[] = this.getLevelsDetailedFromStorage();
    let characterLevel: CharacterLevel = null;
    for (let i = 0;  i < levels.length; i++) {
      const level = levels[i];
      if (level.minExp <= exp && (characterLevel == null || characterLevel.minExp < level.minExp)) {
        characterLevel = level;
      } else if (level.minExp > exp) {
        break;
      }
    }
    return characterLevel;
  }

  getLevelByExp(exp: number): CharacterLevel {
    const levels = this.getLevelsDetailedFromStorage();
    let characterLevel: CharacterLevel = null;
    for (let i = 0;  i < levels.length; i++) {
      const level = levels[i];
      if (level.minExp <= exp && (characterLevel == null || characterLevel.minExp < level.minExp)) {
        characterLevel = level;
      } else if (level.minExp > exp) {
        break;
      }
    }
    return characterLevel;
  }

  getCharacterLevel(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateCharacterLevel(level: CharacterLevel): Promise<any> {
    return this.attributeService.updateAttribute(level);
  }

  deleteCharacterLevel(level: CharacterLevel): Promise<any> {
    return this.attributeService.deleteAttribute(level);
  }

  duplicateCharacterLevel(level: CharacterLevel, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(level, name);
  }
}
