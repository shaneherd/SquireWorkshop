import {Injectable} from '@angular/core';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {Language} from '../../../shared/models/attributes/language';
import {ListObject} from '../../../shared/models/list-object';
import {AttributeService} from './attribute.service';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {Filters} from '../../components/filters/filters';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class LanguageService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private languages: ListObject[] = [];
  private publicLanguages: ListObject[] = [];
  private privateLanguages: ListObject[] = [];

  constructor(
    private attributeService: AttributeService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.languages = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicLanguages = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateLanguages = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.languages;
      case ListSource.PUBLIC_CONTENT:
        return this.publicLanguages;
      case ListSource.PRIVATE_CONTENT:
        return this.privateLanguages;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.languages = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicLanguages = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateLanguages = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.getLanguages(listSource).then((languages: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      languages.forEach((language: ListObject) => {
        menuItems.push(new MenuItem(language.id, language.name, '', '', false));
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

  createLanguage(language: Language): Promise<string> {
    language.attributeType = AttributeType.LANGUAGE;
    return this.attributeService.createAttribute(language);
  }

  getLanguages(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    }
    return this.attributeService.getLanguages(listSource).then((languages: ListObject[]) => {
      this.updateCache(languages, listSource);
      return languages;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getLanguages(listSource);
  }

  getLanguage(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateLanguage(language: Language): Promise<any> {
    return this.attributeService.updateAttribute(language);
  }

  deleteLanguage(language: Language): Promise<any> {
    return this.attributeService.deleteAttribute(language);
  }

  duplicateLanguage(language: Language, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(language, name);
  }
}
