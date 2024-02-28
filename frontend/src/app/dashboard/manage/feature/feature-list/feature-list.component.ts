import {Component, OnDestroy, OnInit} from '@angular/core';
import {FeatureService} from '../../../../core/services/powers/feature.service';
import {FilterDialogData} from '../../../../core/components/filters/filter-dialog-data';
import {Filters} from '../../../../core/components/filters/filters';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {FeatureFilterDialogComponent} from '../../../../core/components/filters/feature-filter-dialog/feature-filter-dialog.component';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.scss']
})
export class FeatureListComponent implements OnInit, OnDestroy {
  loading = true;
  filters: Filters;
  isPublic = false;
  isShared = false;
  listSource: ListSource = ListSource.MY_STUFF;
  queryParamsSub: Subscription;

  constructor(
    public featureService: FeatureService,
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

  filter(): void {
    const self = this;
    const data = new FilterDialogData();
    data.filters = this.filters;
    data.apply = (filters: Filters) => {
      self.applyFilters(filters);
    };
    data.clear = () => {
      self.applyFilters(new Filters());
    };
    data.listSource = this.listSource;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    this.dialog.open(FeatureFilterDialogComponent, dialogConfig);
  }

  applyFilters(filters: Filters): void {
    this.filters = filters;
    this.featureService.updateMenuItemsWithFilters('0', ListSource.MY_STUFF, filters);
  }
}
