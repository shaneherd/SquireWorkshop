import {Component, OnDestroy, OnInit} from '@angular/core';
import {PowerService} from '../../../../core/services/powers/power.service';
import {FeatureService} from '../../../../core/services/powers/feature.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {Filters} from '../../../../core/components/filters/filters';
import {FilterDialogData} from '../../../../core/components/filters/filter-dialog-data';
import {FeatureFilterDialogComponent} from '../../../../core/components/filters/feature-filter-dialog/feature-filter-dialog.component';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ManageListItem} from '../../../../shared/components/manage-list/manage-list.component';
import {FeatureMenuItem} from '../../../selection-list/features-selection-list/features-selection-list.component';
import {FeatureListObject} from '../../../../shared/models/powers/feature-list-object';
import {ExportPowerService} from '../../../../core/services/export/export-power.service';

@Component({
  selector: 'app-feature-manage',
  templateUrl: './feature-manage.component.html',
  styleUrls: ['./feature-manage.component.scss']
})
export class FeatureManageComponent implements OnInit, OnDestroy {
  selectedItem: ManageListItem = null;
  menuItem: FeatureMenuItem = null;
  filters: Filters;
  isPublic = false;
  isShared = false;
  listSource: ListSource = ListSource.MY_STUFF;
  queryParamsSub: Subscription;

  constructor(
    public featureService: FeatureService,
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
    this.menuItem = new FeatureMenuItem(item.listObject as FeatureListObject, item.menuItem.selected);
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
    this.dialog.open(FeatureFilterDialogComponent, dialogConfig);
  }
}
