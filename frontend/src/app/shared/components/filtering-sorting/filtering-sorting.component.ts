import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Filters} from '../../../core/components/filters/filters';
import {Sorts} from '../../../core/components/sorts/sorts';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FilterDialogData} from '../../../core/components/filters/filter-dialog-data';
import {FeatureFilterDialogComponent} from '../../../core/components/filters/feature-filter-dialog/feature-filter-dialog.component';
import {SortDialogData} from '../../../core/components/sorts/sort-dialog-data';
import {FeatureSortDialogComponent} from '../../../core/components/sorts/feature-sort-dialog/feature-sort-dialog.component';
import {FilterType} from '../../../core/components/filters/filter-type.enum';
import {SortType} from '../../../core/components/sorts/sort-type.enum';
import {SpellFilterDialogComponent} from '../../../core/components/filters/spell-filter-dialog/spell-filter-dialog.component';
import {SpellSortDialogComponent} from '../../../core/components/sorts/spell-sort-dialog/spell-sort-dialog.component';
import {ItemFilterDialogComponent} from '../../../core/components/filters/item-filter-dialog/item-filter-dialog.component';
import {NoteFilterDialogComponent} from '../../../core/components/filters/note-filter-dialog/note-filter-dialog.component';
import {NoteSortDialogComponent} from '../../../core/components/sorts/note-sort-dialog/note-sort-dialog.component';
import {SkillSortDialogComponent} from '../../../core/components/sorts/skill-sort-dialog/skill-sort-dialog.component';
import {ConditionSortDialogComponent} from '../../../core/components/sorts/condition-sort-dialog/condition-sort-dialog.component';
import {SkillFilterDialogComponent} from '../../../core/components/filters/skill-filter-dialog/skill-filter-dialog.component';
import {ConditionFilterDialogComponent} from '../../../core/components/filters/condition-filter-dialog/condition-filter-dialog.component';
import {Tag} from '../../models/tag';
import {FilterDataOptionKey} from '../../../core/components/filters/filter-data-option-key.enum';
import {EVENTS} from '../../../constants';
import {EventsService} from '../../../core/services/events.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-filtering-sorting',
  templateUrl: './filtering-sorting.component.html',
  styleUrls: ['./filtering-sorting.component.scss']
})
export class FilteringSortingComponent implements OnInit, OnDestroy {
  @Input() columnIndex: number;
  @Input() clickDisabled = false;
  @Input() filterType: FilterType;
  @Input() filters: Filters;
  @Input() filterOptions = new Map<FilterDataOptionKey, boolean>();
  @Input() tags: Tag[] = [];
  @Output() filter = new EventEmitter();

  @Input() sortType: SortType;
  @Input() sorts: Sorts;
  @Output() sort = new EventEmitter();

  eventSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.eventSub = this.eventsService.events.subscribe(event => {
      switch (this.filterType) {
        case FilterType.ITEM:
          if (event === (EVENTS.MenuAction.ItemFilters + this.columnIndex)) {
            this.filterClick();
          } else if (event === (EVENTS.MenuAction.ItemSorting + this.columnIndex)) {
            this.sortClick();
          }
          break;
        case FilterType.FEATURE:
          if (event === (EVENTS.MenuAction.FeatureFilters + this.columnIndex)) {
            this.filterClick();
          } else if (event === (EVENTS.MenuAction.FeatureSorting + this.columnIndex)) {
            this.sortClick();
          }
          break;
        case FilterType.SKILL:
          if (event === (EVENTS.MenuAction.SkillFilters + this.columnIndex)) {
            this.filterClick();
          } else if (event === (EVENTS.MenuAction.SkillSorting + this.columnIndex)) {
            this.sortClick();
          }
          break;
        case FilterType.NOTE:
          if (event === (EVENTS.MenuAction.NoteFilters + this.columnIndex)) {
            this.filterClick();
          } else if (event === (EVENTS.MenuAction.NoteSorting + this.columnIndex)) {
            this.sortClick();
          }
          break;
        case FilterType.COMPANION:
          if (event === (EVENTS.MenuAction.CompanionFilters + this.columnIndex)) {
            this.filterClick();
          } else if (event === (EVENTS.MenuAction.CompanionSorting + this.columnIndex)) {
            this.sortClick();
          }
          break;
        case FilterType.CONDITION:
          if (event === (EVENTS.MenuAction.ConditionFilters + this.columnIndex)) {
            this.filterClick();
          } else if (event === (EVENTS.MenuAction.ConditionSorting + this.columnIndex)) {
            this.sortClick();
          }
          break;
        case FilterType.SPELL:
          if (event === (EVENTS.MenuAction.SpellFilters + this.columnIndex)) {
            this.filterClick();
          } else if (event === (EVENTS.MenuAction.SpellSorting + this.columnIndex)) {
            this.sortClick();
          }
          break;
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private filterClick(): void {
    if (!this.clickDisabled) {
      const self = this;
      const data = new FilterDialogData();
      data.filters = this.filters;
      data.options = this.filterOptions;
      data.tags = this.tags;
      data.apply = (filters: Filters) => {
        self.filter.emit(filters);
      };
      data.clear = () => {
        self.filter.emit(new Filters());
      };

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;

      switch (this.filterType) {
        case FilterType.ITEM:
          this.dialog.open(ItemFilterDialogComponent, dialogConfig);
          break;
        case FilterType.FEATURE:
          this.dialog.open(FeatureFilterDialogComponent, dialogConfig);
          break;
        case FilterType.SKILL:
          this.dialog.open(SkillFilterDialogComponent, dialogConfig);
          break;
        case FilterType.NOTE:
          this.dialog.open(NoteFilterDialogComponent, dialogConfig);
          break;
        case FilterType.COMPANION:
          // this.dialog.open(CompanionFilterDialogComponent, dialogConfig);
          break;
        case FilterType.CONDITION:
          this.dialog.open(ConditionFilterDialogComponent, dialogConfig);
          break;
        case FilterType.SPELL:
          this.dialog.open(SpellFilterDialogComponent, dialogConfig);
          break;
      }
    }
  }

  private sortClick(): void {
    if (!this.clickDisabled) {
      const self = this;
      const data = new SortDialogData();
      data.sorts = this.sorts;
      data.apply = (sorts: Sorts) => {
        self.sort.emit(sorts);
      };
      data.clear = () => {
        self.sort.emit(new Sorts());
      };

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;

      switch (this.sortType) {
        case SortType.ITEM:
          // this.dialog.open(ItemSortDialogComponent, dialogConfig);
          break;
        case SortType.FEATURE:
          this.dialog.open(FeatureSortDialogComponent, dialogConfig);
          break;
        case SortType.SKILL:
          this.dialog.open(SkillSortDialogComponent, dialogConfig);
          break;
        case SortType.NOTE:
          this.dialog.open(NoteSortDialogComponent, dialogConfig);
          break;
        case SortType.COMPANION:
          // this.dialog.open(CompanionSortDialogComponent, dialogConfig);
          break;
        case SortType.CONDITION:
          this.dialog.open(ConditionSortDialogComponent, dialogConfig);
          break;
        case SortType.SPELL:
          this.dialog.open(SpellSortDialogComponent, dialogConfig);
          break;
      }
    }
  }
}
