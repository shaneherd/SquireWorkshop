import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FilterDialogData} from '../filter-dialog-data';
import {FilterOption} from '../filter-option';
import {FilterValue} from '../filter-value';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {FilterKey} from '../filter-key.enum';
import {DEFAULT_FILTER_TAG_VALUE, DEFAULT_FILTER_VALUE, EVENTS} from '../../../../constants';
import {Filters} from '../filters';
import {TagConfiguration} from '../../../../shared/models/creatures/tag-configuration';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {FilterDataOptionKey} from '../filter-data-option-key.enum';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../services/events.service';
import {SpellFilterService} from '../../../services/spell-filter.service';
import {FilterService} from '../../../services/filter.service';

@Component({
  selector: 'app-spell-filter-dialog',
  templateUrl: './spell-filter-dialog.component.html',
  styleUrls: ['./spell-filter-dialog.component.scss']
})
export class SpellFilterDialogComponent implements OnInit, OnDestroy {
  data: FilterDialogData;
  eventSub: Subscription;
  filters: Filters;
  tagConfigurations: TagConfiguration[] = [];

  //options
  classes: FilterOption[] = [];
  levels: FilterOption[] = [];
  schools: FilterOption[] = [];
  areaOfEffects: FilterOption[] = [];

  //selected values
  prepared = new FilterValue();
  active = new FilterValue();
  concentrating = new FilterValue();
  classChoice = new FilterValue();
  level = new FilterValue();
  school = new FilterValue();
  ritual = new FilterValue();
  areaOfEffect = new FilterValue();
  areaOfEffectChoice = new FilterValue();
  verbal = new FilterValue();
  somatic = new FilterValue();
  material = new FilterValue();
  concentration = new FilterValue();
  instantaneous = new FilterValue();

  defaultOption = DEFAULT_FILTER_VALUE;
  defaultTags = DEFAULT_FILTER_TAG_VALUE;
  keys: FilterKey[] = [];
  showPrepared = false;
  showActive = false;
  showConcentrating = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: FilterDialogData,
    private translate: TranslateService,
    private spellFilterService: SpellFilterService,
    private filterService: FilterService,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<SpellFilterDialogComponent>
  ) {
    this.data = d;
  }

  ngOnInit() {
    this.showPrepared = this.data.options.get(FilterDataOptionKey.PREPARED_APPLICABLE);
    this.showActive = this.data.options.get(FilterDataOptionKey.ACTIVE_APPLICABLE);
    this.showConcentrating = this.data.options.get(FilterDataOptionKey.CONCENTRATING_APPLICABLE);
    this.initializeKeys();
    this.initializeFilterOptions();
    this.initializeFilters();
    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.Logout) {
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeKeys(): void {
    this.keys = [];
    this.keys.push(FilterKey.PREPARED);
    this.keys.push(FilterKey.ACTIVE);
    this.keys.push(FilterKey.CONCENTRATING);
    this.keys.push(FilterKey.SPELL_CLASS);
    this.keys.push(FilterKey.LEVEL);
    this.keys.push(FilterKey.SCHOOL);
    this.keys.push(FilterKey.RITUAL);
    this.keys.push(FilterKey.AREA_OF_EFFECT);
    this.keys.push(FilterKey.SPELL_AREA_OF_EFFECT);
    this.keys.push(FilterKey.VERBAL);
    this.keys.push(FilterKey.SOMATIC);
    this.keys.push(FilterKey.MATERIAL);
    this.keys.push(FilterKey.CONCENTRATION);
    this.keys.push(FilterKey.INSTANTANEOUS);
    this.keys.push(FilterKey.TAGS);
  }

  private initializeFilterOptions(): void {
    this.spellFilterService.initializeFilterOptions(this.data.listSource).then(() => {
      this.classes = this.spellFilterService.classes;
      this.levels = this.spellFilterService.levels;
      this.schools = this.spellFilterService.schools;
      this.areaOfEffects = this.spellFilterService.areaOfEffects;
    });
  }

  private initializeFilters(): void {
    this.filters = new Filters();
    this.keys.forEach((key: FilterKey) => {
      const option = key === FilterKey.TAGS ? this.defaultTags : this.defaultOption;
      this.filters.filterValues.push(this.filterService.getFilterValue(key, this.data.filters.filterValues, option));
    });

    this.initializeSelectedValues();
    this.initializeTags();
  }

  initializeSelectedValues(): void {
    this.filters.filterValues.forEach((filter: FilterValue) => {
      if (filter.value == null || filter.value === '') {
        filter.value = this.defaultOption;
      }
      switch (filter.key) {
        case FilterKey.PREPARED:
          this.prepared = filter;
          break;
        case FilterKey.ACTIVE:
          this.active = filter;
          break;
        case FilterKey.CONCENTRATING:
          this.concentrating = filter;
          break;
        case FilterKey.SPELL_CLASS:
          this.classChoice = filter;
          break;
        case FilterKey.LEVEL:
          this.level = filter;
          break;
        case FilterKey.SCHOOL:
          this.school = filter;
          break;
        case FilterKey.RITUAL:
          this.ritual = filter;
          break;
        case FilterKey.AREA_OF_EFFECT:
          this.areaOfEffect = filter;
          break;
        case FilterKey.SPELL_AREA_OF_EFFECT:
          this.areaOfEffectChoice = filter;
          break;
        case FilterKey.VERBAL:
          this.verbal = filter;
          break;
        case FilterKey.SOMATIC:
          this.somatic = filter;
          break;
        case FilterKey.MATERIAL:
          this.material = filter;
          break;
        case FilterKey.CONCENTRATION:
          this.concentration = filter;
          break;
        case FilterKey.INSTANTANEOUS:
          this.instantaneous = filter;
          break;
      }
    });
  }

  private initializeTags(): void {
    this.tagConfigurations = [];
    const tagValues: string[] = this.filterService.getFilterValue(FilterKey.TAGS, this.filters.filterValues, this.defaultTags).value.split(',');

    for (let i = 0; i < this.data.tags.length; i++) {
      const tag = this.data.tags[i];
      const config = new TagConfiguration();
      config.tag = tag;
      config.checked = tagValues.length > i && tagValues[i] !== '0';
      this.tagConfigurations.push(config);
    }
  }

  private setFilters(): void {
    const filters: FilterValue[] = [];
    filters.push(this.prepared);
    filters.push(this.active);
    filters.push(this.concentrating);
    filters.push(this.classChoice);
    filters.push(this.level);
    filters.push(this.school);
    filters.push(this.ritual);
    filters.push(this.areaOfEffect);
    filters.push(this.areaOfEffectChoice);
    filters.push(this.verbal);
    filters.push(this.somatic);
    filters.push(this.material);
    filters.push(this.concentration);
    filters.push(this.instantaneous);
    filters.push(this.getTagFiltersValue());
    this.data.filters.filterValues = filters;
    this.data.filters.filtersApplied = this.filtersApplied();
  }

  private getSelectedTags(): string {
    const values: string[] = [];
    this.tagConfigurations.forEach((config: TagConfiguration) => {
      values.push(config.checked ? config.tag.id : '0');
    });
    return values.join(',');
  }

  private getTagFiltersValue(): FilterValue {
    const filterValue = new FilterValue();
    filterValue.key = FilterKey.TAGS;
    filterValue.value = this.getSelectedTags();
    return filterValue;
  }

  private filtersApplied(): boolean {
    return this.prepared.value !== this.defaultOption ||
      this.active.value !== this.defaultOption ||
      this.concentrating.value !== this.defaultOption ||
      this.classChoice.value !== this.defaultOption ||
      this.level.value !== this.defaultOption ||
      this.school.value !== this.defaultOption ||
      this.ritual.value !== this.defaultOption ||
      this.areaOfEffect.value !== this.defaultOption ||
      this.verbal.value !== this.defaultOption ||
      this.somatic.value !== this.defaultOption ||
      this.material.value !== this.defaultOption ||
      this.concentration.value !== this.defaultOption ||
      this.instantaneous.value !== this.defaultOption ||
      this.getTagFiltersValue().value !== this.defaultTags;
  }

  apply(): void {
    this.setFilters();
    this.data.apply(this.data.filters);
    this.dialogRef.close();
  }

  private clearFilters(): void {
    this.prepared.value = this.defaultOption;
    this.active.value = this.defaultOption;
    this.concentrating.value = this.defaultOption;
    this.classChoice.value = this.defaultOption;
    this.level.value = this.defaultOption;
    this.school.value = this.defaultOption;
    this.ritual.value = this.defaultOption;
    this.areaOfEffect.value = this.defaultOption;
    this.areaOfEffectChoice.value = this.defaultOption;
    this.verbal.value = this.defaultOption;
    this.somatic.value = this.defaultOption;
    this.material.value = this.defaultOption;
    this.concentration.value = this.defaultOption;
    this.instantaneous.value = this.defaultOption;
    this.clearTags();
  }

  private clearTags(): void {
    this.tagConfigurations.forEach((config: TagConfiguration) => {
      config.checked = false;
    });
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

  tagCheckChange(event: MatCheckboxChange, configuration: TagConfiguration): void {
    configuration.checked = event.checked;
  }
}
