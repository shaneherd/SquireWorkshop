import {Injectable} from '@angular/core';
import {Filters} from '../components/filters/filters';
import {FilterValue} from '../components/filters/filter-value';
import {TranslateService} from '@ngx-translate/core';
import {FilterOption} from '../components/filters/filter-option';
import {ListObject} from '../../shared/models/list-object';
import {FilterService} from './filter.service';
import {CharacterClassService} from './characteristics/character-class.service';
import {SpellSchoolService} from './attributes/spell-school.service';
import {AreaOfEffectService} from './attributes/area-of-effect.service';
import {FilterKey} from '../components/filters/filter-key.enum';
import {DEFAULT_FILTER_VALUE} from '../../constants';
import {ListSource} from '../../shared/models/list-source.enum';

@Injectable({
  providedIn: 'root'
})
export class SpellFilterService {
  classes: FilterOption[] = [];
  levels: FilterOption[] = [];
  schools: FilterOption[] = [];
  areaOfEffects: FilterOption[] = [];

  constructor(
    private translate: TranslateService,
    private characterClassService: CharacterClassService,
    private spellSchoolService: SpellSchoolService,
    private areaOfEffectService: AreaOfEffectService,
    private filterService: FilterService
  ) {
  }

  initializeFilterOptions(listSource: ListSource = ListSource.MY_STUFF): Promise<any> {
    this.initializeLevels();

    const promises: Promise<any>[] = [];
    promises.push(this.initializeClasses(listSource));
    promises.push(this.initializeSchools(listSource));
    promises.push(this.initializeAreaOfEffects(listSource));
    return Promise.all(promises);
  }

  private initializeClasses(listSource: ListSource): Promise<any> {
    if (this.classes.length > 0) {
      return Promise.resolve();
    }
    this.classes = [];
    this.classes.push(new FilterOption(DEFAULT_FILTER_VALUE, this.translate.instant('All')));
    return this.characterClassService.getClasses(true, false, listSource).then((classes: ListObject[]) => {
      classes.forEach((characterClass: ListObject) => {
        this.classes.push(new FilterOption(characterClass.id, characterClass.name));
      });
    });
  }

  private initializeLevels(): void {
    this.levels = [];
    this.levels.push(new FilterOption(DEFAULT_FILTER_VALUE, this.translate.instant('All')));
    this.levels.push(new FilterOption('0', this.translate.instant('Cantrip')));
    this.levels.push(new FilterOption('1', '1'));
    this.levels.push(new FilterOption('2', '2'));
    this.levels.push(new FilterOption('3', '3'));
    this.levels.push(new FilterOption('4', '4'));
    this.levels.push(new FilterOption('5', '5'));
    this.levels.push(new FilterOption('6', '6'));
    this.levels.push(new FilterOption('7', '7'));
    this.levels.push(new FilterOption('8', '8'));
    this.levels.push(new FilterOption('9', '9'));
  }

  private initializeSchools(listSource: ListSource): Promise<any> {
    this.schools = [];
    this.schools.push(new FilterOption(DEFAULT_FILTER_VALUE, this.translate.instant('All')));
    return this.spellSchoolService.getSpellSchools(listSource).then((schools: ListObject[]) => {
      schools.forEach((school: ListObject) => {
        this.schools.push(new FilterOption(school.id, school.name));
      });
    });
  }

  private initializeAreaOfEffects(listSource: ListSource): Promise<any> {
    this.areaOfEffects = [];
    this.areaOfEffects.push(new FilterOption(DEFAULT_FILTER_VALUE, this.translate.instant('All')));
    return this.areaOfEffectService.getAreaOfEffects(listSource).then((areaOfEffects: ListObject[]) => {
      areaOfEffects.forEach((areaOfEffect: ListObject) => {
        this.areaOfEffects.push(new FilterOption(areaOfEffect.id, areaOfEffect.name));
      });
    });
  }

  getFilterDisplay(filters: Filters): string {
    if (filters == null) {
      filters = new Filters();
    }

    const parts: string[] = [];
    filters.filterValues.forEach((filterValue: FilterValue) => {
      if (filterValue.value !== DEFAULT_FILTER_VALUE) {
        const display = this.getSpellFilterDisplay(filterValue);
        if (display !== '') {
          parts.push(display);
        }
      }
    });
    if (parts.length === 0) {
      return this.translate.instant('All');
    } else {
      return parts.join(' - ');
    }
  }

  private getSpellFilterDisplay(filterValue: FilterValue): string {
    let option: FilterOption = null;
    switch (filterValue.key) {
      case FilterKey.PREPARED:
      case FilterKey.ACTIVE:
      case FilterKey.CONCENTRATING:
      case FilterKey.RITUAL:
      case FilterKey.VERBAL:
      case FilterKey.SOMATIC:
      case FilterKey.MATERIAL:
      case FilterKey.CONCENTRATION:
      case FilterKey.INSTANTANEOUS:
        return this.filterService.getYesNoDisplay(filterValue.value, this.translate.instant('FilterKey.' + filterValue.key));
      // case FilterKey.AREA_OF_EFFECT:
      //   break;
      case FilterKey.SPELL_CLASS:
        option = this.getClassDisplay(filterValue.value);
        break;
      case FilterKey.LEVEL:
        option = this.getLevelDisplay(filterValue.value);
        break;
      case FilterKey.SCHOOL:
        option = this.getSchoolDisplay(filterValue.value);
        break;
      case FilterKey.SPELL_AREA_OF_EFFECT:
        option = this.getAreaOfEffectDisplay(filterValue.value);
        break;
      // case FilterKey.TAGS:
      //   option = this.getTagDisplay(filterValue.value);
      //   break;
    }

    if (option == null) {
      return '';
    } else {
      return option.display;
    }
  }

  private getClassDisplay(value: string): FilterOption {
    return this.filterService.getFilterOption(value, this.classes);
  }

  private getLevelDisplay(value: string): FilterOption {
    return this.filterService.getFilterOption(value, this.levels);
  }

  private getSchoolDisplay(value: string): FilterOption {
    return this.filterService.getFilterOption(value, this.schools);
  }

  private getAreaOfEffectDisplay(value: string): FilterOption {
    return this.filterService.getFilterOption(value, this.areaOfEffects);
  }

  // private getTagDisplay(value: string): FilterOption {
  //   return this.filterService.getFilterOption(value, this.tags);
  // }
}
