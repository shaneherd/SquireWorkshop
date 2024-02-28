import {Injectable} from '@angular/core';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {Condition} from '../../../shared/models/attributes/condition';
import {AttributeService} from './attribute.service';
import {AttributeType} from '../../../shared/models/attributes/attribute-type.enum';
import {ListObject} from '../../../shared/models/list-object';
import {Attribute} from '../../../shared/models/attributes/attribute';
import {ConnectingConditionCollection} from '../../../shared/models/connecting-condition-collection';
import {ConnectingConditionCollectionItem} from '../../../shared/models/connecting-condition-collection-item';
import * as _ from 'lodash';
import {LOCAL_STORAGE} from '../../../constants';
import {HttpClient} from '@angular/common/http';
import {Filters} from '../../components/filters/filters';
import {Sorts} from '../../components/sorts/sorts';
import {FilterSorts} from '../../../shared/models/filter-sorts';
import {environment} from '../../../../environments/environment';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class ConditionService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private conditions: ListObject[] = [];
  private publicConditions: ListObject[] = [];
  private privateConditions: ListObject[] = [];
  private conditionsDetailed: Condition[] = [];
  private publicConditionsDetailed: Condition[] = [];
  private privateConditionsDetailed: Condition[] = [];

  constructor(
    private attributeService: AttributeService,
    private http: HttpClient
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.conditions = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicConditions = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateConditions = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.conditions;
      case ListSource.PUBLIC_CONTENT:
        return this.publicConditions;
      case ListSource.PRIVATE_CONTENT:
        return this.privateConditions;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.conditions = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicConditions = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateConditions = list;
        break;
    }
  }

  private resetDetailedCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.conditionsDetailed = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicConditionsDetailed = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateConditionsDetailed = [];
        break;
    }
  }

  private getDetailedCached(listSource: ListSource): Condition[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.conditionsDetailed;
      case ListSource.PUBLIC_CONTENT:
        return this.publicConditionsDetailed;
      case ListSource.PRIVATE_CONTENT:
        return this.privateConditionsDetailed;
    }
  }

  private updateDetailedCache(list: Condition[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.conditionsDetailed = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicConditionsDetailed = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateConditionsDetailed = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.resetCache(listSource);
    this.resetDetailedCache(listSource);
    this.getConditions(listSource).then((conditions: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      conditions.forEach((condition: ListObject) => {
        menuItems.push(new MenuItem(condition.id, condition.name, '', '', false));
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

  initializeConditions(): Promise<ListObject[]> {
    return this.getConditions().then((conditions: ListObject[]) => {
      localStorage.setItem(LOCAL_STORAGE.CONDITIONS, JSON.stringify(conditions));
      return conditions;
    })
  }

  getConditionsFromStorage(): ListObject[] {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE.CONDITIONS));
  }

  createCondition(condition: Condition): Promise<string> {
    condition.attributeType = AttributeType.CONDITION;
    return this.attributeService.createAttribute(condition);
  }

  getFilteredConditions(filters: Filters, sorts: Sorts): Promise<ListObject[]> {
    const filterSorts = new FilterSorts(filters, sorts);
    return this.attributeService.getFilteredConditions(filterSorts, ListSource.MY_STUFF);
  }

  getConditions(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    }
    return this.attributeService.getConditions(listSource).then((conditions: ListObject[]) => {
      this.updateCache(conditions, listSource);
      return conditions;
    });
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getConditions(listSource);
  }

  getConditionsDetailed(listSource: ListSource = ListSource.MY_STUFF): Promise<Condition[]> {
    const cache = this.getDetailedCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    }
    return this.http.get<Condition[]>(`${environment.backendUrl}/attributes/type/${AttributeType.CONDITION}/detailed?source=${listSource}`)
      .toPromise().then((conditions: Condition[]) => {
        conditions.forEach((condition: Condition) => {
          condition.type = 'Condition';
        });
        this.updateDetailedCache(conditions, listSource);
        return conditions;
      });
  }

  getConditionBySID(sid: number): ListObject {
    const conditions = this.getConditionsFromStorage();
    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];
      if (condition.sid === sid) {
        return condition;
      }
    }
    return null;
  }

  getCondition(id: string): Promise<Attribute> {
    return this.attributeService.getAttribute(id);
  }

  updateCondition(condition: Condition): Promise<any> {
    return this.attributeService.updateAttribute(condition);
  }

  deleteCondition(condition: Condition): Promise<any> {
    return this.attributeService.deleteAttribute(condition);
  }

  duplicateCondition(condition: Condition, name: string): Promise<string> {
    return this.attributeService.duplicateAttribute(condition, name);
  }

  /******************************* Connecting Conditions *************************************/

  initializeConnectingConditionConfigurations(condition: Condition, listSource: ListSource = ListSource.MY_STUFF): Promise<ConnectingConditionCollection> {
    const collection = new ConnectingConditionCollection();
    return this.getConditions(listSource).then((conditions: ListObject[]) => {
      conditions.forEach((current: ListObject) => {
        if (current.id !== condition.id) {
          const item: ConnectingConditionCollectionItem = new ConnectingConditionCollectionItem();
          item.condition = current;
          item.checked = this.isConnecting(current, condition.connectingConditions);
          collection.connectingConditions.push(item);
        }
      });
      return collection;
    });
  }

  private isConnecting(condition: ListObject, connectingConditions: ListObject[]): boolean {
    for (let i = 0; i < connectingConditions.length; i++) {
      const current: ListObject = connectingConditions[i];
      if (current.id === condition.id) {
        return true;
      }
    }
    return false;
  }

  setConnectingConditions(collection: ConnectingConditionCollection, condition: Condition): void {
    const connectingConditions: ListObject[] = [];
    collection.connectingConditions.forEach((item: ConnectingConditionCollectionItem) => {
      if (item.checked) {
        connectingConditions.push(item.condition);
      }
    });
    condition.connectingConditions = connectingConditions;
  }

  createCopyOfCollection(collection: ConnectingConditionCollection): ConnectingConditionCollection {
    return _.cloneDeep(collection);
  }
}
