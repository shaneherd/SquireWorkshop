import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FilterDialogData} from '../filter-dialog-data';
import {Subscription} from 'rxjs';
import {Filters} from '../filters';
import {FilterOption} from '../filter-option';
import {FilterValue} from '../filter-value';
import {DEFAULT_FILTER_VALUE, EVENTS} from '../../../../constants';
import {TranslateService} from '@ngx-translate/core';
import {EventsService} from '../../../services/events.service';
import * as _ from 'lodash';
import {FilterKey} from '../filter-key.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MonsterFilterService} from '../../../services/monster-filter.service';

@Component({
  selector: 'app-monster-filter-dialog',
  templateUrl: './monster-filter-dialog.component.html',
  styleUrls: ['./monster-filter-dialog.component.scss']
})
export class MonsterFilterDialogComponent implements OnInit, OnDestroy {
  data: FilterDialogData;
  eventSub: Subscription;
  filters: Filters;

  //options
  monsterTypes: FilterOption[] = [];
  challengeRatings: FilterOption[] = [];
  alignments: FilterOption[] = [];

  //selected values
  search: FilterValue;
  monsterType: FilterValue;
  challengeRating: FilterValue;
  alignment: FilterValue;
  spellcaster: FilterValue;
  legendary: FilterValue;
  flying: FilterValue;
  swimming: FilterValue;

  defaultOption = DEFAULT_FILTER_VALUE;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: FilterDialogData,
    private translate: TranslateService,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<MonsterFilterDialogComponent>,
    private monsterFilterService: MonsterFilterService
  ) {
    this.data = d;
  }

  ngOnInit() {
    this.monsterFilterService.initializeFilterOptions(this.data.listSource).then(() => {
      this.initializeFilterOptions();
      this.initializeFilters();
    });
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  initializeFilters(): void {
    if (this.data.filters.filterValues == null) {
      this.data.filters.filterValues = [];
    }
    this.filters = _.cloneDeep(this.data.filters);
    this.initializeDefaultSearch();
    this.initializeDefaultOption(FilterKey.MONSTER_TYPE);
    this.initializeDefaultOption(FilterKey.CHALLENGE_RATING);
    this.initializeDefaultOption(FilterKey.ALIGNMENT);
    this.initializeDefaultOption(FilterKey.SPELLCASTER);
    this.initializeDefaultOption(FilterKey.LEGENDARY);
    this.initializeDefaultOption(FilterKey.FLYING);
    this.initializeDefaultOption(FilterKey.SWIMMING);

    this.initializeSelectedValues();
  }

  private initializeDefaultSearch(): void {
    if (!this.hasOption(this.filters.filterValues, FilterKey.SEARCH)) {
      this.filters.filterValues.push(this.getFilterValue(FilterKey.SEARCH, ''));
    }
  }

  private initializeDefaultOption(key: FilterKey): void {
    if (!this.hasOption(this.filters.filterValues, key)) {
      this.filters.filterValues.push(this.getFilterValue(key, this.defaultOption));
    }
  }

  private hasOption(filters: FilterValue[], key: FilterKey): boolean {
    for (let i = 0; i < filters.length; i++) {
      if (filters[i].key === key) {
        return true;
      }
    }
    return false;
  }

  initializeSelectedValues(): void {
    this.filters.filterValues.forEach((filter: FilterValue) => {
      switch (filter.key) {
        case FilterKey.SEARCH:
          this.search = filter;
          break;
        case FilterKey.MONSTER_TYPE:
          this.monsterType = filter;
          break;
        case FilterKey.CHALLENGE_RATING:
          this.challengeRating = filter;
          break;
        case FilterKey.ALIGNMENT:
          this.alignment = filter;
          break;
        case FilterKey.SPELLCASTER:
          this.spellcaster = filter;
          break;
        case FilterKey.LEGENDARY:
          this.legendary = filter;
          break;
        case FilterKey.FLYING:
          this.flying = filter;
          break;
        case FilterKey.SWIMMING:
          this.swimming = filter;
          break;
      }
    });
  }

  initializeFilterOptions(): void {
    this.monsterTypes = this.monsterFilterService.monsterTypes;
    this.challengeRatings = this.monsterFilterService.challengeRatings;
    this.alignments = this.monsterFilterService.alignments;
  }

  private getFilterValue(key: FilterKey, value: string): FilterValue {
    const filterValue = new FilterValue();
    filterValue.key = key;
    filterValue.value = value;
    return filterValue;
  }

  private setFilters(): void {
    const filters: FilterValue[] = [];
    filters.push(this.search);
    filters.push(this.monsterType);
    filters.push(this.challengeRating);
    filters.push(this.alignment);
    filters.push(this.spellcaster);
    filters.push(this.legendary);
    filters.push(this.flying);
    filters.push(this.swimming);
    this.data.filters.filterValues = filters;
    this.data.filters.filtersApplied = this.filtersApplied();
  }

  private filtersApplied(): boolean {
    return this.monsterType.value !== this.defaultOption
      || this.challengeRating.value !== this.defaultOption
      || this.alignment.value !== this.defaultOption
      || this.spellcaster.value !== this.defaultOption
      || this.legendary.value !== this.defaultOption
      || this.flying.value !== this.defaultOption
      || this.swimming.value !== this.defaultOption;
  }

  apply(): void {
    this.setFilters();
    this.data.apply(this.data.filters);
    this.dialogRef.close();
  }

  private clearFilters(): void {
    //don't clear the search value
    this.monsterType.value = this.defaultOption;
    this.challengeRating.value = this.defaultOption;
    this.alignment.value = this.defaultOption;
    this.spellcaster.value = this.defaultOption;
    this.legendary.value = this.defaultOption;
    this.flying.value = this.defaultOption;
    this.swimming.value = this.defaultOption;
  }

  clear(): void {
    this.clearFilters();
    this.setFilters();
    this.data.clear();
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
