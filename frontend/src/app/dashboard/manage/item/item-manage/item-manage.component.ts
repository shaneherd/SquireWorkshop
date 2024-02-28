import {Component, OnDestroy, OnInit} from '@angular/core';
import {ItemService} from '../../../../core/services/items/item.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Filters} from '../../../../core/components/filters/filters';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {Subscription} from 'rxjs';
import {FilterDialogData} from '../../../../core/components/filters/filter-dialog-data';
import {ItemFilterDialogComponent} from '../../../../core/components/filters/item-filter-dialog/item-filter-dialog.component';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {ExportItemService} from '../../../../core/services/export/export-item.service';

@Component({
  selector: 'app-item-manage',
  templateUrl: './item-manage.component.html',
  styleUrls: ['./item-manage.component.scss']
})
export class ItemManageComponent implements OnInit, OnDestroy {
  selectedItem: ManageListItem = null;
  filters: Filters;
  isPublic = false;
  isShared = false;
  listSource: ListSource = ListSource.MY_STUFF;
  queryParamsSub: Subscription;

  constructor(
    public itemService: ItemService,
    public exportService: ExportItemService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.filters = new Filters()

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
      });
  }

  ngOnDestroy() {
    this.queryParamsSub.unsubscribe();
  }

  onItemClick(item: ManageListItem): void {
    this.selectedItem = item;
  }

  updateSelected(menuItem: MenuItem): void {
    this.selectedItem.menuItem.selected = !this.selectedItem.menuItem.selected;
    this.selectedItem = null;
  }

  closeItem(): void {
    this.selectedItem = null;
  }

  filter(callback: (filters: Filters) => void): void {
    const self = this;
    const data = new FilterDialogData();
    data.filters = this.filters;
    data.apply = (filters: Filters) => {
      self.filters = filters;
      callback(self.filters);
    };
    data.clear = () => {
      self.filters = new Filters();
      callback(self.filters);
    };
    data.listSource = this.listSource;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(ItemFilterDialogComponent, dialogConfig);
  }
}
