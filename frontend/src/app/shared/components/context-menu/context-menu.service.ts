import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {MenuItem} from '../../models/menuItem.model';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from '../../../core/services/user.service';
import {UserModel} from '../../models/user.model';
import {UserSubscriptionType} from '../../models/user-subscription-type.enum';
import {FEATURE_FLAG_ID} from '../../../constants';
import {FeatureFlagService} from '../../../core/services/feature-flag.service';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService implements OnDestroy {
  public CHARACTERS = '1';
  public GM_MODE = '2';
  public QUICK_REFERENCES = '3';
  public ARMOR_TYPES = '4';
  public BACKGROUNDS = '5';
  public CASTER_TYPES = '6';
  public CLASSES = '7';
  public CONDITIONS = '8';
  public DAMAGE_TYPES = '9';
  public FEATS = '10';
  public ITEMS = '11';
  public LANGUAGES = '12';
  public RACES = '13';
  public SKILLS = '14';
  public SPELLS = '15';
  public WEAPON_PROPERTIES = '16';
  public ALIGNMENTS = '17';
  public AREA_OF_EFFECTS = '18';
  public DEITIES = '19';
  public DEITY_CATEGORIES = '20';
  public LEVELS = '21';
  public TOOL_CATEGORIES = '22';
  public MY_STUFF = '23';
  public PUBLIC_CONTENT = '24';
  public SHARED_WITH_ME = '25';
  public MY_PUBLISHED_CONTENT = '26';
  public CAMPAIGNS = '27';
  public MONSTERS = '28';

  private homeMenuItems: MenuItem[] = this.getDefaultHomeItems();
  private topMenuItems: MenuItem[] = this.getDefaultTopMenuItems();
  private bottomMenuItems: MenuItem[] = this.getDefaultBottomMenuItems();

  homeItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.homeMenuItems);
  topItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.topMenuItems);
  bottomItems: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>(this.bottomMenuItems);
  userSub: Subscription;
  user: UserModel;
  isPro = false;
  monsterConfigurationsEnabled = false;

  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private featureFlagService: FeatureFlagService
  ) {
    this.userSub = this.userService.userSubject.subscribe(async user => {
      this.user = user;
      this.isPro = this.user != null && this.user.userSubscription.type !== UserSubscriptionType.FREE;
      this.monsterConfigurationsEnabled = await this.featureFlagService.isFeatureEnabledForCurrentUser(FEATURE_FLAG_ID.MONSTER_CONFIGURATIONS);
      this.topItems.next(this.getDefaultTopMenuItems());
      this.bottomItems.next(this.getDefaultBottomMenuItems());
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  getDefaultHomeItems(): MenuItem[] {
    const menuItems: MenuItem[] = [];
    menuItems.push(new MenuItem(this.MY_STUFF, this.translate.instant('Navigation.MyStuff'), 'side-nav', 'myStuff', false));
    menuItems.push(new MenuItem(this.PUBLIC_CONTENT, this.translate.instant('Navigation.PublicContent'), 'side-nav', 'public', false));
    // menuItems.push(new MenuItem(this.SHARED_WITH_ME, this.translate.instant('Navigation.SharedWithMe'), 'side-nav', 'shared', false));
    return menuItems;
  }

  getDefaultTopMenuItems(): MenuItem[] {
    const menuItems: MenuItem[] = [];
    menuItems.push(new MenuItem(this.CHARACTERS, this.translate.instant('Navigation.Characters.Characters'), 'side-nav', 'characters', false));

    if (this.isPro) {
      menuItems.push(new MenuItem(this.CAMPAIGNS, this.translate.instant('Navigation.Manage.Campaigns.Campaigns'), 'side-nav', 'campaigns', false));
      // menuItems.push(new MenuItem(this.GM_MODE, this.translate.instant('Navigation.GmMode'), 'side-nav', 'gmMode', false));
    }
    // menuItems.push(new MenuItem(this.PUBLIC_CONTENT, 'Public Content', 'side-nav', 'gmMode', true));
    // menuItems.push(new MenuItem(this.SHARED_WITH_ME, 'Shared With Me', 'side-nav', 'gmMode', true));
    // menuItems.push(new MenuItem(this.MY_PUBLISHED_CONTENT, 'My Published Content', 'side-nav', 'gmMode', true));
    // menuItems.push(new MenuItem(this.QUICK_REFERENCES,
    //   this.translate.instant('Navigation.QuickReferences'), 'side-nav', 'quickReferences', true));
    return menuItems;
  }

  getDefaultBottomMenuItems(): MenuItem[] {
    const menuItems: MenuItem[] = [];
    menuItems.push(new MenuItem(this.ARMOR_TYPES,
      this.translate.instant('Navigation.Manage.ArmorTypes.ArmorTypes'), 'side-nav', 'armorTypes', false));
    menuItems.push(new MenuItem(this.BACKGROUNDS,
      this.translate.instant('Navigation.Manage.Backgrounds.Backgrounds'), 'side-nav', 'backgrounds', false));
    menuItems.push(new MenuItem(this.CASTER_TYPES,
      this.translate.instant('Navigation.Manage.CasterTypes.CasterTypes'), 'side-nav', 'casterTypes', false));
    menuItems.push(new MenuItem(this.CLASSES,
      this.translate.instant('Navigation.Manage.Classes.Classes'), 'side-nav', 'classes', false));
    menuItems.push(new MenuItem(this.CONDITIONS,
      this.translate.instant('Navigation.Manage.Conditions.Conditions'), 'side-nav', 'conditions', false));
    menuItems.push(new MenuItem(this.DAMAGE_TYPES,
      this.translate.instant('Navigation.Manage.DamageTypes.DamageTypes'), 'side-nav', 'damageTypes', false));
    menuItems.push(new MenuItem(this.FEATS,
      this.translate.instant('Navigation.Manage.Features.Features'), 'side-nav', 'features', false));
    menuItems.push(new MenuItem(this.ITEMS,
      this.translate.instant('Navigation.Manage.Items.Items'), 'side-nav', 'items', false));
    menuItems.push(new MenuItem(this.LANGUAGES,
      this.translate.instant('Navigation.Manage.Languages.Languages'), 'side-nav', 'languages', false));
    if (this.isPro && this.monsterConfigurationsEnabled) {
      menuItems.push(new MenuItem(this.MONSTERS,
        this.translate.instant('Navigation.Manage.Monsters.Monsters'), 'side-nav', 'monsters', false));
    }
    menuItems.push(new MenuItem(this.RACES,
      this.translate.instant('Navigation.Manage.Races.Races'), 'side-nav', 'races', false));
    menuItems.push(new MenuItem(this.SKILLS,
      this.translate.instant('Navigation.Manage.Skills.Skills'), 'side-nav', 'skills', false));
    menuItems.push(new MenuItem(this.SPELLS,
      this.translate.instant('Navigation.Manage.Spells.Spells'), 'side-nav', 'spells', false));
    menuItems.push(new MenuItem(this.WEAPON_PROPERTIES,
      this.translate.instant('Navigation.Manage.WeaponProperties.WeaponProperties'), 'side-nav', 'weaponProperties', false));
    menuItems.push(new MenuItem(this.ALIGNMENTS,
      this.translate.instant('Navigation.Manage.Alignments.Alignments'), 'side-nav', 'alignments', false));
    menuItems.push(new MenuItem(this.AREA_OF_EFFECTS,
      this.translate.instant('Navigation.Manage.AreaOfEffects.AreaOfEffects'), 'side-nav', 'areaOfEffects', false));
    menuItems.push(new MenuItem(this.DEITIES,
      this.translate.instant('Navigation.Manage.Deities.Deities'), 'side-nav', 'deities', false));
    menuItems.push(new MenuItem(this.DEITY_CATEGORIES,
      this.translate.instant('Navigation.Manage.DeityCategories.DeityCategories'), 'side-nav', 'deityCategories', false));
    // menuItems.push(new MenuItem(this.LEVELS,
    //   this.translate.instant('Navigation.Manage.Levels.Levels'), 'side-nav', 'levels', false));
    menuItems.push(new MenuItem(this.TOOL_CATEGORIES,
      this.translate.instant('Navigation.Manage.ToolCategories.ToolCategories'), 'side-nav', 'toolCategories', false));

    menuItems.sort(function(left: MenuItem, right: MenuItem) {
      return left.name.localeCompare(right.name);
    });

    return menuItems;
  }
}
