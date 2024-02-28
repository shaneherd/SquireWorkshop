import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SlideInHeader} from '../../models/slideInHeader.model';
import {MenuService} from '../list-menu/list-menu.component';
import {MenuItem} from '../../models/menuItem.model';
import {MatCheckboxChange} from '@angular/material/checkbox';
import * as _ from 'lodash';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Filters} from '../../../core/components/filters/filters';
import {ManageResultsDialogData, ManageType} from '../../../core/components/manage-results-dialog/manage-results-dialog-data';
import {ManageResultsDialogComponent} from '../../../core/components/manage-results-dialog/manage-results-dialog.component';
import {ListSource} from '../../models/list-source.enum';
import {ListObject} from '../../models/list-object';
import {PublishRequest} from '../../models/publish-request';
import {ExportDetailsService} from '../../../core/services/export/export.service';

export interface ManageService {
  delete: (id: string) => Promise<any>;
  publish(id: string, publishRequest: PublishRequest): Promise<any>;
}

export class ManageListItem {
  listObject: ListObject;
  menuItem: MenuItem;
  visible = true;
}

@Component({
  selector: 'app-manage-list',
  templateUrl: './manage-list.component.html',
  styleUrls: ['./manage-list.component.scss']
})
export class ManageListComponent implements OnInit {
  @Input() headerName: string;
  @Input() menuService: MenuService;
  @Input() manageService: ManageService;
  @Input() exportService: ExportDetailsService;
  @Input() filterable = false;
  @Input() exportable = false;
  @Input() exportType = '';
  @Input() filters: Filters = null;

  @Output() itemClick = new EventEmitter<ManageListItem>();
  @Output() filter = new EventEmitter<(filters: Filters) => void>();

  loading = false;
  slideInHeader: SlideInHeader;
  searchValue = '';
  allSelected = false;

  items: ManageListItem[] = [];
  filteredItems: ManageListItem[] = [];

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.slideInHeader = new SlideInHeader(this.headerName, false, null);
    this.slideInHeader.showBack = false;
    this.slideInHeader.showShare = false;
    this.refreshList(false);
  }

  deleteClick(): void {
    const self = this;
    this.showConfirmation(this.getSelectedItems(), ManageType.DELETE, () => {
      self.refreshList(true);
      self.menuService.updateMenuItems(null, ListSource.MY_STUFF, null);
    });
  }

  shareClick(): void {
    this.showConfirmation(this.getSelectedItems(), ManageType.SHARE, () => {
      this.items.forEach((item: ManageListItem) => {
        item.menuItem.selected = false;
      });
    });
  }

  exportClick(): void {
    if (this.exportable) {
      this.showConfirmation(this.getSelectedItems(), ManageType.EXPORT, () => {
        this.items.forEach((item: ManageListItem) => {
          item.menuItem.selected = false;
        });
      });
    }
  }

  private showConfirmation(selectedItems: ManageListItem[], manageType: ManageType, callback: () => void): void {
    const data = new ManageResultsDialogData();
    data.items = selectedItems;
    data.manageType = manageType;
    data.service = this.manageService;
    data.exportService = this.exportService;
    data.exportType = this.exportType;
    data.done = callback;
    data.cancel = () => {}
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ManageResultsDialogComponent, dialogConfig);
  }

  private getSelectedItems(): ManageListItem[] {
    return _.filter(this.items, (item: ManageListItem) => {
      return item.menuItem.selected === true;
    });
  }

  optionChange(event: MatCheckboxChange, item: ManageListItem): void {
    item.menuItem.selected = event.checked;
    this.updateAllComplete();
  }

  menuItemClick(item: ManageListItem): void {
    this.itemClick.emit(item);
  }

  selectAll(event: MatCheckboxChange): void {
    this.allSelected = event.checked;
    this.filteredItems.forEach((item: ManageListItem) => {
      item.menuItem.selected = this.allSelected;
    });
  }

  someSelected(): boolean {
    if (this.filteredItems == null) {
      return false;
    }
    return this.filteredItems.filter(item => item.menuItem.selected).length > 0 && !this.allSelected;
  }

  noneSelected(): boolean {
    if (this.items == null) {
      return true;
    }
    return this.items.filter(item => item.menuItem.selected).length === 0;
  }

  updateAllComplete() {
    this.allSelected = this.filteredItems != null && this.filteredItems.length > 0 && this.filteredItems.every(item => item.menuItem.selected);
  }

  private getVisibleItems(): ManageListItem[] {
    return _.filter(this.items, (item: ManageListItem) => {
      return item.visible === true;
    });
  }

  search(): void {
    const value = this.searchValue.trim().toLowerCase();
    const visibleItems = this.getVisibleItems();
    if (value.length === 0) {
      this.filteredItems = visibleItems;
    } else {
      const filtered: ManageListItem[] = [];
      visibleItems.forEach((item: ManageListItem) => {
        if (item.menuItem.name.toLowerCase().indexOf(value) > -1) {
          filtered.push(item);
        }
      });
      this.filteredItems = filtered;
    }
    this.updateAllComplete();
  }

  filterClick(): void {
    if (this.filter != null && this.filterable) {
      const self = this;
      const callback = (filters: Filters) => {
        self.menuService.getList(ListSource.MY_STUFF, filters, false).then((list: ListObject[]) => {
          self.items.forEach((item: ManageListItem) => {
            item.visible = self.isVisible(item, list);
          });
          self.search();
          self.loading = false;
        });
      }
      this.filter.emit(callback);
    }
  }

  private isVisible(item: ManageListItem, list: ListObject[]): boolean {
    const matchingItem = _.find(list, (listObject: ListObject) => { return listObject.id === item.listObject.id; });
    return matchingItem != null;
  }

  private convertListObjects(list: ListObject[]): ManageListItem[] {
    const items: ManageListItem[] = [];
    list.forEach((listObject: ListObject) => {
      const menuItem = new MenuItem(listObject.id, listObject.name);
      const item = new ManageListItem();
      item.listObject = listObject;
      item.menuItem = menuItem;
      items.push(item);
    });
    return items;
  }

  private refreshList(clearCache: boolean): void {
    this.loading = true;
    this.menuService.getList(ListSource.MY_STUFF, new Filters(), clearCache).then((list: ListObject[]) => {
      this.items = this.convertListObjects(list);
      if (this.filterable && this.filters != null && this.filters.filtersApplied) {
        const self = this;
        this.menuService.getList(ListSource.MY_STUFF, this.filters, false).then((filtered: ListObject[]) => {
          self.items.forEach((item: ManageListItem) => {
            item.visible = self.isVisible(item, filtered);
          });
          self.search();
          self.loading = false;
        });
      } else {
        this.search();
        this.loading = false;
      }
    });
  }
}
