import { Injectable } from '@angular/core';
import {MenuItem} from '../../models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CharacterContextMenuService {
  public CHARACTER_INFO = '1';
  public EDIT = '2';
  public PAGE_ORDER = '3';
  public QUICK_REFERENCES = '4';
  public ROLL_LOG = '5';
  public CHARACTER_SETTINGS = '6';
  public VALIDATE_CHARACTER = '7';
  public JOIN_CAMPAIGN = '8';
  public LEAVE_CAMPAIGN = '9';
  public PRINT_CHARACTER = '10';
  public EXPORT_CHARACTER = '11';

  bottomMenuItems: MenuItem[] = [];
  private displayed = false;
  private id: string;
  private inCampaign = false;
  private isAuthor = true;

  bottomItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.bottomMenuItems);
  display: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.displayed);
  characterId: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private translate: TranslateService) {
    this.translate.get('init').subscribe(data => {
      this.bottomMenuItems = this.getCharacterBottomMenuItems();
      this.bottomItems.next(this.bottomMenuItems);
    });
  }

  setDisplay(display: boolean): void {
    this.displayed = display;
    this.display.next(this.displayed);
  }

  setId(id: string): void {
    this.id = id;
    this.characterId.next(this.id);
  }

  setInCampaign(inCampaign: boolean): void {
    this.inCampaign = inCampaign;
    this.bottomMenuItems = this.getCharacterBottomMenuItems();
    this.bottomItems.next(this.bottomMenuItems);
  }

  setIsAuthor(isAuthor: boolean): void {
    this.isAuthor = isAuthor;
    this.bottomMenuItems = this.getCharacterBottomMenuItems();
    this.bottomItems.next(this.bottomMenuItems);
  }

  getCharacterBottomMenuItems(): MenuItem[] {
    const menuItems: MenuItem[] = [];
    menuItems.push(new MenuItem(this.EDIT, this.translate.instant('Navigation.Characters.EditCharacter'),
      'middle-nav', 'editCharacter', !this.isAuthor));
    menuItems.push(new MenuItem(this.PAGE_ORDER, this.translate.instant('Navigation.Characters.PageOrder'),
      'middle-nav', 'pageOrder', false));
    menuItems.push(new MenuItem(this.QUICK_REFERENCES, this.translate.instant('Navigation.Characters.QuickReferences'),
      'middle-nav', 'quickReferences', false));
    menuItems.push(new MenuItem(this.CHARACTER_SETTINGS, this.translate.instant('Navigation.Characters.Settings'),
      'middle-nav', 'characterSettings', false));
    menuItems.push(new MenuItem(this.ROLL_LOG, this.translate.instant('Navigation.Characters.RollLog'),
      'middle-nav', 'rollLog', false));
    menuItems.push(new MenuItem(this.VALIDATE_CHARACTER, this.translate.instant('Navigation.Characters.UpdateCharacter'),
      'middle-nav', 'validateCharacter', !this.isAuthor))
    menuItems.push(new MenuItem(this.PRINT_CHARACTER, this.translate.instant('Navigation.Characters.PrintToPDF'),
      'middle-nav', 'print', false));

    if (this.inCampaign) {
      menuItems.push(new MenuItem(this.LEAVE_CAMPAIGN, this.translate.instant('Navigation.Characters.LeaveCampaign'),
        'middle-nav', 'leaveCampaign', !this.isAuthor));
    } else {
      menuItems.push(new MenuItem(this.JOIN_CAMPAIGN, this.translate.instant('Navigation.Characters.JoinCampaign'),
        'middle-nav', 'joinCampaign', !this.isAuthor));
    }

    menuItems.push(new MenuItem(this.EXPORT_CHARACTER, this.translate.instant('Navigation.Characters.Export'),
      'middle-nav', 'export', false));
    return menuItems;
  }

  setDisabled(disabled: boolean): void {
    this.bottomMenuItems.forEach((menuItem: MenuItem) => {
      menuItem.disabled = disabled;
    });
  }
}
