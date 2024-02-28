import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpellService} from '../../../../core/services/powers/spell.service';
import {FilterDialogData} from '../../../../core/components/filters/filter-dialog-data';
import {Filters} from '../../../../core/components/filters/filters';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {SpellFilterDialogComponent} from '../../../../core/components/filters/spell-filter-dialog/spell-filter-dialog.component';
import {ListSource} from '../../../../shared/models/list-source.enum';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-spell-list',
  templateUrl: './spell-list.component.html',
  styleUrls: ['./spell-list.component.scss']
})
export class SpellListComponent implements OnInit, OnDestroy {
  loading = true;
  filters: Filters;
  isPublic = false;
  isShared = false;
  listSource: ListSource = ListSource.MY_STUFF;
  queryParamsSub: Subscription;

  constructor(
    public spellService: SpellService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.filters = new Filters();

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
    this.dialog.open(SpellFilterDialogComponent, dialogConfig);
  }

  applyFilters(filters: Filters): void {
    this.filters = filters;
    this.spellService.updateMenuItemsWithFilters('0', this.listSource, filters);
  }
}
