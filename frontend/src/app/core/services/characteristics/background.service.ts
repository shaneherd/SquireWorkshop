import {Injectable} from '@angular/core';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {ListObject} from '../../../shared/models/list-object';
import {Background} from '../../../shared/models/characteristics/background';
import {CharacteristicType} from '../../../shared/models/characteristics/characteristic-type.enum';
import {CharacteristicService} from './characteristic.service';
import {Characteristic} from '../../../shared/models/characteristics/characteristic';
import {BackgroundTrait} from '../../../shared/models/characteristics/background-trait';
import * as _ from 'lodash';
import {BackgroundTraitCollection} from '../../../dashboard/manage/background/background-info/background-info.component';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private backgrounds: ListObject[] = [];
  private publicBackgrounds: ListObject[] = [];
  private privateBackgrounds: ListObject[] = [];
  private allBackgrounds: ListObject[] = [];

  constructor(
    private characteristicService: CharacteristicService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.backgrounds = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicBackgrounds = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateBackgrounds = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.backgrounds;
      case ListSource.PUBLIC_CONTENT:
        return this.publicBackgrounds;
      case ListSource.PRIVATE_CONTENT:
        return this.privateBackgrounds;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.backgrounds = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicBackgrounds = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateBackgrounds = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getBackgrounds(false, false, listSource).then((backgrounds: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      backgrounds.forEach((background: ListObject) => {
        menuItems.push(new MenuItem(background.id, background.name, '', '', false));
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

  createBackground(background: Background): Promise<string> {
    background.characteristicType = CharacteristicType.BACKGROUND;
    return this.characteristicService.createCharacteristic(background);
  }

  getBackgrounds(includeChildren: boolean = false, authorOnly: boolean = false, listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    if (includeChildren && this.allBackgrounds.length > 0) {
      return Promise.resolve(this.allBackgrounds);
    } else if (!includeChildren) {
      const cache = this.getCached(listSource);
      if (cache.length > 0) {
        return Promise.resolve(cache.slice());
      }
    }
    return this.characteristicService.getBackgrounds(includeChildren, authorOnly, listSource).then((backgrounds: ListObject[]) => {
      if (includeChildren) {
        this.allBackgrounds = backgrounds;
      } else {
        this.updateCache(backgrounds, listSource);
      }
      return backgrounds;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getBackgrounds(false, false, listSource);
  }

  getBackground(id: string): Promise<Characteristic> {
    return this.characteristicService.getCharacteristic(id);
  }

  updateBackground(background: Background): Promise<any> {
    return this.characteristicService.updateCharacteristic(background);
  }

  deleteBackground(background: Background): Promise<any> {
    return this.characteristicService.deleteCharacteristic(background);
  }

  duplicateBackground(background: Background, name: string): Promise<string> {
    return this.characteristicService.duplicateCharacteristic(background, name);
  }

  /***************************************** Traits ******************************************************/

  getAllVariations(background: Background): BackgroundTrait[] {
    let allVariations: BackgroundTrait[] = [];
    if (background.parent) {
      allVariations = this.getAllVariations(background.parent as Background);
    }
    background.variations.forEach((trait: BackgroundTrait) => {
      allVariations.push(trait);
    });
    return allVariations;
  }

  getAllPersonalities(background: Background): BackgroundTrait[] {
    let allVariations: BackgroundTrait[] = [];
    if (background.parent) {
      allVariations = this.getAllPersonalities(background.parent as Background);
    }
    background.personalities.forEach((trait: BackgroundTrait) => {
      allVariations.push(trait);
    });
    return allVariations;
  }

  getAllIdeals(background: Background): BackgroundTrait[] {
    let allVariations: BackgroundTrait[] = [];
    if (background.parent) {
      allVariations = this.getAllIdeals(background.parent as Background);
    }
    background.ideals.forEach((trait: BackgroundTrait) => {
      allVariations.push(trait);
    });
    return allVariations;
  }

  getAllBonds(background: Background): BackgroundTrait[] {
    let allVariations: BackgroundTrait[] = [];
    if (background.parent) {
      allVariations = this.getAllBonds(background.parent as Background);
    }
    background.bonds.forEach((trait: BackgroundTrait) => {
      allVariations.push(trait);
    });
    return allVariations;
  }

  getAllFlaws(background: Background): BackgroundTrait[] {
    let allVariations: BackgroundTrait[] = [];
    if (background.parent) {
      allVariations = this.getAllFlaws(background.parent as Background);
    }
    background.flaws.forEach((trait: BackgroundTrait) => {
      allVariations.push(trait);
    });
    return allVariations;
  }

  createCopyOfTraitCollection(backgroundTraitCollection: BackgroundTraitCollection): BackgroundTraitCollection {
    return _.cloneDeep(backgroundTraitCollection);
  }
}
