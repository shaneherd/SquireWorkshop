import {Component, OnDestroy, OnInit} from '@angular/core';
import {PowerService} from '../../../../core/services/powers/power.service';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Filters} from '../../../../core/components/filters/filters';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {Subscription} from 'rxjs';
import {FilterDialogData} from '../../../../core/components/filters/filter-dialog-data';
import {SpellFilterDialogComponent} from '../../../../core/components/filters/spell-filter-dialog/spell-filter-dialog.component';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {SpellMenuItem} from '../../../selection-list/spell-selection-list/spell-selection-list.component';
import {SpellListObject} from '../../../../shared/models/powers/spell-list-object';
import {ExportPowerService} from '../../../../core/services/export/export-power.service';

@Component({
  selector: 'app-spell-manage',
  templateUrl: './spell-manage.component.html',
  styleUrls: ['./spell-manage.component.scss']
})
export class SpellManageComponent implements OnInit, OnDestroy {
  selectedItem: ManageListItem = null;
  menuItem: SpellMenuItem = null;
  filters: Filters;
  isPublic = false;
  isShared = false;
  listSource: ListSource = ListSource.MY_STUFF;
  queryParamsSub: Subscription;

  constructor(
    public spellService: SpellService,
    public powerService: PowerService,
    public exportService: ExportPowerService,
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
    this.menuItem = new SpellMenuItem(item.listObject as SpellListObject, item.menuItem.selected);
  }

  updateSelected(menuItem: MenuItem): void {
    this.selectedItem.menuItem.selected = !this.selectedItem.menuItem.selected;
    this.selectedItem = null;
    this.menuItem = null;
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
    this.dialog.open(SpellFilterDialogComponent, dialogConfig);
  }

}
