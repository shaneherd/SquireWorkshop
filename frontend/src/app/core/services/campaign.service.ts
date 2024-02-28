import { Injectable } from '@angular/core';
import {MenuService} from '../../shared/components/list-menu/list-menu.component';
import {MenuItem} from '../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {ListSource} from '../../shared/models/list-source.enum';
import {Filters} from '../components/filters/filters';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ListObject} from '../../shared/models/list-object';
import {environment} from '../../../environments/environment';
import {Campaign} from '../../shared/models/campaigns/campaign';
import {CampaignSettings} from '../../shared/models/campaigns/campaign-settings';

@Injectable({
  providedIn: 'root'
})
export class CampaignService implements MenuService {
  private items: MenuItem[] = [];
  menuItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.items);
  private campaigns: ListObject[] = [];

  constructor(
    private http: HttpClient
  ) { }

  updateMenuItems(id: string, listSource: ListSource = ListSource.MY_STUFF, filters: Filters = null): void {
    this.updateMenuItemsWithFilters(id, listSource, filters);
  }

  updateMenuItemsWithFilters(id: string, listSource: ListSource, filters: Filters): void {
    if (filters == null) {
      this.resetCache();
    }
    this.getCampaigns().then((campaigns: ListObject[]) => {
      const menuItems: MenuItem[] = [];
      campaigns.forEach((campaign: ListObject) => {
        menuItems.push(new MenuItem(campaign.id, campaign.name, '', '', false));
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

  getCampaigns(): Promise<ListObject[]> {
    const cache = this.getCached();
    if (cache.length > 0) {
      return Promise.resolve(cache.slice());
    } else {
      return this.http.get<ListObject[]>(`${environment.backendUrl}/campaigns`).toPromise()
        .then((campaigns: ListObject[]) => {
          this.updateCache(campaigns);
          return campaigns;
        });
    }
  }

  getList(listSource: ListSource, filters: Filters, clearCache: boolean): Promise<ListObject[]> {
    if (clearCache) {
      this.resetCache();
    }
    return this.getCampaigns();
  }

  private resetCache(): void {
    this.campaigns = [];
  }

  private getCached(): ListObject[] {
    return this.campaigns;
  }

  private updateCache(list: ListObject[]): void {
    this.campaigns = list;
  }

  createCampaign(campaign: Campaign): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.put<string>(`${environment.backendUrl}/campaigns`, campaign, options).toPromise();
  }

  updateCampaign(campaign: Campaign): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/campaigns/${campaign.id}`, campaign).toPromise();
  }

  getCampaign(id: string): Promise<Campaign> {
    return this.http.get<Campaign>(`${environment.backendUrl}/campaigns/${id}`).toPromise();
  }

  deleteCampaign(id: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/campaigns/${id}`).toPromise();
  }

  duplicateCampaign(id: string, name: string): Promise<string> {
    const body = new URLSearchParams();
    body.set('name', name);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(`${environment.backendUrl}/campaigns/${id}/duplicate`, body.toString(), options).toPromise();
  }

  removeCharacterFromCampaign(id: string, characterId: string): Promise<any> {
    return this.http.delete<any>(`${environment.backendUrl}/campaigns/${id}/characters/${characterId}`).toPromise();
  }

  refreshToken(campaignId: string): Promise<string> {
    const options = {
      responseType: 'text' as 'json'
    };
    return this.http.post<any>(`${environment.backendUrl}/campaigns/${campaignId}/refreshToken`, {}, options).toPromise();
  }

  updateSettings(campaignId: string, settings: CampaignSettings): Promise<any> {
    return this.http.post<any>(`${environment.backendUrl}/campaigns/${campaignId}/settings`, settings).toPromise();
  }
}
