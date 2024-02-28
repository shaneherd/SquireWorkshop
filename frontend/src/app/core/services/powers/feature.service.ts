import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {PowerService} from './power.service';
import {MenuService} from '../../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {ListObject} from '../../../shared/models/list-object';
import {Feature} from '../../../shared/models/powers/feature';
import {PowerType} from '../../../shared/models/powers/power-type.enum';
import {Power} from '../../../shared/models/powers/power';
import {Filters} from '../../components/filters/filters';
import {environment} from '../../../../environments/environment';
import {ListSource} from '../../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class FeatureService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private features: ListObject[] = [];
  private publicFeatures: ListObject[] = [];
  private privateFeatures: ListObject[] = [];

  constructor(
    private http: HttpClient,
    private powerService: PowerService
  ) {
  }

  private resetCache(listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.features = [];
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicFeatures = [];
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateFeatures = [];
        break;
    }
  }

  private getCached(listSource: ListSource): ListObject[] {
    switch (listSource) {
      case ListSource.MY_STUFF:
        return this.features;
      case ListSource.PUBLIC_CONTENT:
        return this.publicFeatures;
      case ListSource.PRIVATE_CONTENT:
        return this.privateFeatures;
    }
  }

  private updateCache(list: ListObject[], listSource: ListSource): void {
    switch (listSource) {
      case ListSource.MY_STUFF:
        this.features = list;
        break;
      case ListSource.PUBLIC_CONTENT:
        this.publicFeatures = list;
        break;
      case ListSource.PRIVATE_CONTENT:
        this.privateFeatures = list;
        break;
    }
  }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.updateMenuItemsWithFilters(id, listSource, filters);
  }

  updateMenuItemsWithFilters(id: string, listSource: ListSource, filters: Filters): void {
    if (filters == null) {
      this.resetCache(listSource);
      this.features = [];
    }
    this.getFeaturesWithFilters(listSource, filters).then((features: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      features.forEach((feature: ListObject) => {
        menuItems.push(new MenuItem(feature.id, feature.name, '', '', false));
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

  createFeature(feature: Feature): Promise<string> {
    feature.powerType = PowerType.FEATURE;
    return this.powerService.createPower(feature);
  }

  getFeatures(listSource: ListSource = ListSource.MY_STUFF): Promise<ListObject[]> {
    const cache = this.getCached(listSource);
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    } else {
      return this.powerService.getFeatures(listSource).then((features: ListObject[]) => {
        this.updateCache(features, listSource);
        return features;
      });
    }
  }

  getFeaturesWithFilters(listSource: ListSource, filters: Filters): Promise<ListObject[]> {
    if (filters == null || filters.filterValues.length === 0 || !filters.filtersApplied) {
      return this.getFeatures(listSource);
    }

    return this.http.post<ListObject[]>(`${environment.backendUrl}/powers/type/${PowerType.FEATURE}?source=${listSource}`, filters).toPromise();
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache(listSource);
    }
    return this.getFeaturesWithFilters(listSource, filters);
  }

  getFeature(id: string): Promise<Power> {
    return this.powerService.getPower(id);
  }

  updateFeature(feature: Feature): Promise<any> {
    return this.powerService.updatePower(feature);
  }

  deleteFeature(feature: Feature): Promise<any> {
    return this.powerService.deletePower(feature);
  }

  duplicateFeature(feature: Feature, name: string): Promise<string> {
    return this.powerService.duplicatePower(feature, name);
  }
}
