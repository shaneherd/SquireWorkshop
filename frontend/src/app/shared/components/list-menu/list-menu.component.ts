import {Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MenuItem} from '../../models/menuItem.model';
import {BehaviorSubject, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {EVENTS, SKIP_LOCATION_CHANGE} from '../../../constants';
import {MatDrawer} from '@angular/material/sidenav';
import {EventsService} from '../../../core/services/events.service';
import {Filters} from '../../../core/components/filters/filters';
import {ListSource} from '../../models/list-source.enum';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {ButtonAction} from '../../models/button/button-action';
import {TranslateService} from '@ngx-translate/core';
import {ListObject} from '../../models/list-object';

export interface MenuService {
  menuItems: BehaviorSubject<MenuItem[]>;
  updateMenuItems: (id: string, listSource: ListSource, filters: Filters) => void;
  getList: (listSource: ListSource, filters: Filters, clearCache: boolean) => Promise<ListObject[]>;
}

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss']
})
export class ListMenuComponent implements OnInit, OnDestroy {
  @ViewChild(MatDrawer, {static: false})
  drawer: MatDrawer;

  @Input() headerName: string;
  @Input() baseNavigation: string;
  @Input() subNavigation: string;
  @Input() parentNavigation = 'default';
  @Input() menuService: MenuService;
  @Input() showAddNewItem = true;
  @Input() newItemLabel = '';
  @Input() searchable = true;
  @Input() filterable = false;
  @Input() manageable = true;
  @Input() filters: Filters = null;

  @Output() onMenuItemSelected = new EventEmitter();
  @Output() filter = new EventEmitter();

  @ViewChild(CdkVirtualScrollViewport, {static: false})
  viewport: CdkVirtualScrollViewport;

  searchValue = '';
  menuItems: MenuItem[];
  filteredMenuItems: MenuItem[];
  loading = true;
  addNewMenuItem: MenuItem;
  selectedId: string = null;
  parentId: string = null;
  isPublic = false;
  isShared = false;
  listSource: ListSource = ListSource.MY_STUFF;

  queryParamsSub: Subscription;
  routeSub: Subscription;
  menuSub: Subscription;

  actions: ButtonAction[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.addNewMenuItem = new MenuItem('0', '', '', '', false);
    this.addNewMenuItem.icon = 'fas fa-plus';

    this.queryParamsSub = this.route.queryParams
      .subscribe((params: {public: string, shared: string}) => {
        this.isPublic = params.public != null && params.public === 'true';
        this.isShared = params.shared != null && params.shared === 'true';
        if (this.isPublic) {
          this.listSource = ListSource.PUBLIC_CONTENT;
        } else if (this.isShared) {
          this.listSource = ListSource.PRIVATE_CONTENT;
        } else {
          this.listSource = ListSource.MY_STUFF;
        }

        if (this.isPublic || this.isShared) {
          this.manageable = false;
        }
      });

    this.routeSub = this.route.params.subscribe((params: { id: string, childId: string }) => {
      if (params.childId != null) {
        this.selectedId = params.childId;
        this.parentId = params.id;
      } else if (params.id != null) {
        this.selectedId = params.id;
      } else {
        this.selectedId = null;
      }
      this.updateSelected();
    });

    this.menuSub = this.menuService.menuItems.subscribe((menuItems: MenuItem[]) => {
      this.menuItems = menuItems;
      this.search();
      this.loading = false;
      this.updateSelected();
    });
    this.menuService.updateMenuItems(this.selectedId, this.listSource, this.filters);

    this.initializeActions();
  }

  private initializeActions(): void {
    this.actions = [];
    const self = this;
    if (this.showAddNewItem && this.newItemLabel !== '' && !this.isPublic && !this.isShared) {
      const useBtn = new ButtonAction('NEW_ITEM', this.newItemLabel === '' ? this.translate.instant('NewItem') : this.newItemLabel, () => {
        this.menuItemCLick(this.addNewMenuItem);
      });
      this.actions.push(useBtn);

      // if (this.manageable) {
      //   const manageBtn = new ButtonAction('MANAGE_LIST', self.translate.instant('Manage'), () => {
      //     this.manageList();
      //   });
      //   this.actions.push(manageBtn);
      // }
    }
  }

  ngOnDestroy() {
    this.queryParamsSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.menuSub.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.viewport.checkViewportSize();
  }

  addItemOnSelect(menuItem: MenuItem): void {
    this.menuItemCLick(menuItem);
  }

  onSelect(menuItem: MenuItem): void {
    this.menuItemCLick(menuItem);
  }

  manageList(): void {
    const extras = {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': this.isPublic, 'shared': this.isShared}};
    if (this.parentId != null) {
      this.router.navigate([this.baseNavigation, {outlets: {
          'middle-nav': [`${this.subNavigation}Manage`, this.parentId]
        }}], extras);
    } else {
      this.router.navigate([this.baseNavigation, {
        outlets: {
          'middle-nav': [`${this.subNavigation}Manage`]
        }
      }], extras);
    }

    this.eventsService.dispatchEvent(EVENTS.CloseMenu);
  }

  menuItemCLick(menuItem: MenuItem): void {
    if (!menuItem.disabled) {
      setTimeout(() => {
        this.onMenuItemSelected.emit(menuItem);
      });

      const extras = {skipLocationChange: SKIP_LOCATION_CHANGE, queryParams: {'public': this.isPublic, 'shared': this.isShared}};
      if (this.parentId != null) {
        this.router.navigate([this.baseNavigation, {outlets: {
            'middle-nav': [this.subNavigation, this.parentId, menuItem.id],
            'side-nav': [this.subNavigation, this.parentId, menuItem.id]
          }}], extras);
      } else {
        this.router.navigate([this.baseNavigation, {
          outlets: {
            'middle-nav': [this.subNavigation, menuItem.id],
            'side-nav': [this.subNavigation, menuItem.id]
          }
        }], extras);
      }

      this.eventsService.dispatchEvent(EVENTS.CloseMenu);
    }
  }

  private updateSelected(): void {
    if (this.menuItems != null) {
      this.menuItems.forEach((menuItem: MenuItem) => {
        menuItem.selected = menuItem.id === this.selectedId;
      });
    }
  }

  search(): void {
    const value = this.searchValue.trim().toLowerCase();
    if (value.length === 0) {
      this.filteredMenuItems = this.menuItems;
    } else {
      const filtered: MenuItem[] = [];
      this.menuItems.forEach((menuItem: MenuItem) => {
        if (menuItem.name.toLowerCase().indexOf(value) > -1) {
          filtered.push(menuItem);
        }
      });
      this.filteredMenuItems = filtered;
    }
  }

  filterClick(): void {
    if (this.filter != null) {
      this.filter.emit();
    }
  }

  onBack(): void {
    if (this.isPublic && (this.parentNavigation === '' || this.parentNavigation === 'default')) {
      this.parentNavigation = 'public';
    }
    if (this.isShared && (this.parentNavigation === '' || this.parentNavigation === 'default')) {
      this.parentNavigation = 'shared';
    }
    if (this.parentId != null) {
      this.router.navigate(['/home/dashboard',
        {outlets: {'side-nav': [this.parentNavigation, this.parentId]}}], {skipLocationChange: SKIP_LOCATION_CHANGE });
    } else {
      this.router.navigate(['/home/dashboard',
        {outlets: {'side-nav': [this.parentNavigation]}}], {skipLocationChange: SKIP_LOCATION_CHANGE });
    }
  }
}
