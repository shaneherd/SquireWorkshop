import { Injectable } from '@angular/core';
import {MenuItem} from '../../../shared/models/menuItem.model';
import {BehaviorSubject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class EncounterContextMenuService {
  public QUICK_REFERENCES = '1';
  public ROLL_LOG = '2';
  public ADD_CREATURES = '3';
  public REORDER_INITIATIVE = '4';
  public RESTART_ENCOUNTER = '5';
  public FINISH_ENCOUNTER = '6';
  public NOTIFICATIONS = '7';
  public ATTACK = '8';
  public PAUSE_ENCOUNTER = '9';
  public INITIATIVE = '10';

  bottomMenuItems: MenuItem[] = [];
  private displayed = false;
  private id: string;
  private inCampaign = false;
  private isAuthor = true;
  private mobile = true;

  bottomItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.bottomMenuItems);
  display: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.displayed);
  encounterId: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private translate: TranslateService) {
    this.translate.get('init').subscribe(data => {
      this.bottomMenuItems = this.getEncounterBottomMenuItems();
      this.bottomItems.next(this.bottomMenuItems);
    });
  }

  setDisplay(display: boolean): void {
    this.displayed = display;
    this.display.next(this.displayed);
  }

  setMobile(mobile: boolean): void {
    this.mobile = mobile;
    this.bottomMenuItems = this.getEncounterBottomMenuItems();
    this.bottomItems.next(this.bottomMenuItems);
  }

  setId(id: string): void {
    this.id = id;
    this.encounterId.next(this.id);
  }

  getEncounterBottomMenuItems(): MenuItem[] {
    const menuItems: MenuItem[] = [];

    if (this.mobile) {
      menuItems.push(new MenuItem(this.INITIATIVE, this.translate.instant('Navigation.Encounter.Initiative'),
        'middle-nav', 'initiative', false));
    }

    menuItems.push(new MenuItem(this.ADD_CREATURES, this.translate.instant('Navigation.Encounter.AddCreatures'),
      'middle-nav', 'addCreatures', false));
    menuItems.push(new MenuItem(this.REORDER_INITIATIVE, this.translate.instant('Navigation.Encounter.ReorderInitiative'),
      'middle-nav', 'reorderInitiative', false));
    menuItems.push(new MenuItem(this.PAUSE_ENCOUNTER, this.translate.instant('Navigation.Encounter.PauseEncounter'),
      'middle-nav', 'pause', false));
    menuItems.push(new MenuItem(this.RESTART_ENCOUNTER, this.translate.instant('Navigation.Encounter.RestartEncounter'),
      'middle-nav', 'restartEncounter', false));
    menuItems.push(new MenuItem(this.FINISH_ENCOUNTER, this.translate.instant('Navigation.Encounter.FinishEncounter'),
      'middle-nav', 'finishEncounter', false));

    // menuItems.push(new MenuItem(this.QUICK_REFERENCES, this.translate.instant('Navigation.Encounter.QuickReferences'),
    //   'middle-nav', 'quickReferences', false));
    // menuItems.push(new MenuItem(this.ROLL_LOG, this.translate.instant('Navigation.Encounter.RollLog'),
    //   'middle-nav', 'rollLog', false));
    // menuItems.push(new MenuItem(this.NOTIFICATIONS, this.translate.instant('Navigation.Encounter.Notifications'),
    //   'middle-nav', 'notifications', false));
    // menuItems.push(new MenuItem(this.ATTACK, this.translate.instant('Navigation.Encounter.Attack'),
    //   'middle-nav', 'attack', false));

    return menuItems;
  }

  setDisabled(disabled: boolean): void {
    this.bottomMenuItems.forEach((menuItem: MenuItem) => {
      menuItem.disabled = disabled;
    });
  }
}
