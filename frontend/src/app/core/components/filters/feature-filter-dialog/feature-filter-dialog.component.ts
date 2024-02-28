import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FilterDialogData} from '../filter-dialog-data';
import {FilterOption} from '../filter-option';
import {FilterValue} from '../filter-value';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {FilterKey} from '../filter-key.enum';
import {CharacteristicType} from '../../../../shared/models/characteristics/characteristic-type.enum';
import {ListObject} from '../../../../shared/models/list-object';
import {CharacterClassService} from '../../../services/characteristics/character-class.service';
import {AreaOfEffectService} from '../../../services/attributes/area-of-effect.service';
import {RaceService} from '../../../services/characteristics/race.service';
import {BackgroundService} from '../../../services/characteristics/background.service';
import {CharacterLevelService} from '../../../services/character-level.service';
import {Filters} from '../filters';
import {TagConfiguration} from '../../../../shared/models/creatures/tag-configuration';
import {DEFAULT_FILTER_TAG_VALUE, DEFAULT_FILTER_VALUE, EVENTS} from '../../../../constants';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {FilterDataOptionKey} from '../filter-data-option-key.enum';
import {FeatureFilterService} from '../../../services/powers/feature-filter.service';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../services/events.service';

@Component({
  selector: 'app-feature-filter-dialog',
  templateUrl: './feature-filter-dialog.component.html',
  styleUrls: ['./feature-filter-dialog.component.scss']
})
export class FeatureFilterDialogComponent implements OnInit, OnDestroy {
  data: FilterDialogData;
  eventSub: Subscription;
  filters: Filters;
  tagConfigurations: TagConfiguration[] = [];

  //options
  categories: FilterOption[] = [];
  classes: FilterOption[] = [];
  races: FilterOption[] = [];
  backgrounds: FilterOption[] = [];
  levels: FilterOption[] = [];
  areaOfEffects: FilterOption[] = [];

  //selected values
  active = new FilterValue();
  passive = new FilterValue();
  category: FilterValue;
  classChoice: FilterValue;
  raceChoice: FilterValue;
  backgroundChoice: FilterValue;
  level: FilterValue;
  range: FilterValue;
  areaOfEffect: FilterValue;
  areaOfEffectChoice: FilterValue;

  defaultOption = DEFAULT_FILTER_VALUE;
  defaultTags = DEFAULT_FILTER_TAG_VALUE;
  keys: FilterKey[] = [];
  showActive = false;
  showPassive = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public d: FilterDialogData,
    private featureFilterService: FeatureFilterService,
    private translate: TranslateService,
    private characterClassService: CharacterClassService,
    private raceService: RaceService,
    private backgroundService: BackgroundService,
    private characterLevelService: CharacterLevelService,
    private areaOfEffectService: AreaOfEffectService,
    private eventsService: EventsService,
    private dialogRef: MatDialogRef<FeatureFilterDialogComponent>
  ) {
    this.data = d;
  }

  ngOnInit() {
    this.showActive = this.data.options.get(FilterDataOptionKey.ACTIVE_APPLICABLE) || false;
    this.showPassive = this.data.options.get(FilterDataOptionKey.PASSIVE_APPLICABLE) || false;
    this.keys = this.featureFilterService.getKeys();
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

  initializeFilters(): void {
    this.filters = this.featureFilterService.initializeFilters(this.data);

    this.initializeSelectedValues();
    this.initializeTags();
  }

  initializeSelectedValues(): void {
    this.filters.filterValues.forEach((filter: FilterValue) => {
      switch (filter.key) {
        case FilterKey.ACTIVE:
          this.active = filter;
          break;
        case FilterKey.PASSIVE:
          this.passive = filter;
          break;
        case FilterKey.FEATURE_CATEGORY:
          this.category = filter;
          break;
        case FilterKey.FEATURE_CLASS:
          this.classChoice = filter;
          break;
        case FilterKey.FEATURE_RACE:
          this.raceChoice = filter;
          break;
        case FilterKey.FEATURE_BACKGROUND:
          this.backgroundChoice = filter;
          break;
        case FilterKey.LEVEL:
          this.level = filter;
          break;
        case FilterKey.RANGE:
          this.range = filter;
          break;
        case FilterKey.AREA_OF_EFFECT:
          this.areaOfEffect = filter;
          break;
        case FilterKey.FEATURE_AREA_OF_EFFECT:
          this.areaOfEffectChoice = filter;
          break;
      }
    });
  }

  initializeFilterOptions(): void {
    this.initializeCategories();
    this.initializeClasses();
    this.initializeRaces();
    this.initializeBackgrounds();
    this.initializeLevels();
    this.initializeAreaOfEffects();
  }

  initializeCategories(): void {
    this.categories = [];
    this.categories.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    this.categories.push(new FilterOption(CharacteristicType.CLASS,
      this.translate.instant('CharacteristicType.' + CharacteristicType.CLASS)));
    this.categories.push(new FilterOption(CharacteristicType.RACE,
      this.translate.instant('CharacteristicType.' + CharacteristicType.RACE)));
    this.categories.push(new FilterOption(CharacteristicType.BACKGROUND,
      this.translate.instant('CharacteristicType.' + CharacteristicType.BACKGROUND)));
    this.categories.push(new FilterOption('FEAT', this.translate.instant('Feat')));
  }

  initializeClasses(): void {
    this.classes = [];
    this.classes.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    this.characterClassService.getClasses(true, false, this.data.listSource).then((classes: ListObject[]) => {
      classes.forEach((characterClass: ListObject) => {
        this.classes.push(new FilterOption(characterClass.id, characterClass.name));
      });
    });
  }

  initializeRaces(): void {
    this.races = [];
    this.races.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    this.raceService.getRaces(false, false, this.data.listSource).then((races: ListObject[]) => {
      races.forEach((race: ListObject) => {
        this.races.push(new FilterOption(race.id, race.name));
      });
    });
  }

  initializeBackgrounds(): void {
    this.backgrounds = [];
    this.backgrounds.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    this.backgroundService.getBackgrounds(false, false, this.data.listSource).then((backgrounds: ListObject[]) => {
      backgrounds.forEach((background: ListObject) => {
        this.backgrounds.push(new FilterOption(background.id, background.name));
      });
    });
  }

  initializeLevels(): void {
    this.levels = [];
    this.levels.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    this.characterLevelService.getLevels(this.data.listSource).then((levels: ListObject[]) => {
      levels.forEach((level: ListObject) => {
        this.levels.push(new FilterOption(level.id, level.name));
      });
    });
  }

  initializeAreaOfEffects(): void {
    this.areaOfEffects = [];
    this.areaOfEffects.push(new FilterOption(this.defaultOption, this.translate.instant('All')));
    this.areaOfEffectService.getAreaOfEffects(this.data.listSource).then((areaOfEffects: ListObject[]) => {
      areaOfEffects.forEach((areaOfEffect: ListObject) => {
        this.areaOfEffects.push(new FilterOption(areaOfEffect.id, areaOfEffect.name));
      });
    });
  }

  private initializeTags(): void {
    this.tagConfigurations = [];
    const tagValues: string[] = this.getFilterValue(FilterKey.TAGS, this.filters.filterValues, this.defaultTags).value.split(',');

    for (let i = 0; i < this.data.tags.length; i++) {
      const tag = this.data.tags[i];
      const config = new TagConfiguration();
      config.tag = tag;
      config.checked = tagValues.length > i && tagValues[i] !== '0';
      this.tagConfigurations.push(config);
    }
  }

  isClass(): boolean {
    return this.category.value === CharacteristicType.CLASS;
  }

  isRace(): boolean {
    return this.category.value === CharacteristicType.RACE;
  }

  isBackground(): boolean {
    return this.category.value === CharacteristicType.BACKGROUND;
  }

  private getFilterValue(key: FilterKey, filterValues: FilterValue[], defaultValue: string): FilterValue {
    for (let i = 0; i < filterValues.length; i++) {
      const filter = filterValues[i];
      if (filter.key === key) {
        return filter;
      }
    }

    const filterValue = new FilterValue();
    filterValue.key = key;
    filterValue.value = defaultValue;
    return filterValue;
  }

  private setFilters(): void {
    const filters: FilterValue[] = [];
    filters.push(this.active);
    filters.push(this.passive);
    filters.push(this.category);
    filters.push(this.classChoice);
    filters.push(this.raceChoice);
    filters.push(this.backgroundChoice);
    filters.push(this.level);
    filters.push(this.range);
    filters.push(this.areaOfEffect);
    filters.push(this.areaOfEffectChoice);
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
    return this.active.value !== this.defaultOption ||
      this.passive.value !== this.defaultOption ||
      this.category.value !== this.defaultOption ||
      this.level.value !== this.defaultOption ||
      this.range.value !== this.defaultOption ||
      this.getTagFiltersValue().value !== this.defaultTags;
  }

  apply(): void {
    this.setFilters();
    this.data.apply(this.data.filters);
    this.dialogRef.close();
  }

  private clearFilters(): void {
    if (this.showActive) {
      this.active.value = this.defaultOption;
    }
    if (this.showPassive) {
      this.passive.value = this.defaultOption;
    }
    this.classChoice.value = this.defaultOption;
    this.raceChoice.value = this.defaultOption;
    this.backgroundChoice.value = this.defaultOption;
    this.level.value = this.defaultOption;
    this.range.value = this.defaultOption;
    this.areaOfEffect.value = this.defaultOption;
    this.areaOfEffectChoice.value = this.defaultOption;
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
