import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {ListObject} from '../../../../shared/models/list-object';
import {ConditionService} from '../../../../core/services/attributes/condition.service';
import {Condition} from '../../../../shared/models/attributes/condition';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {FilterType} from '../../../../core/components/filters/filter-type.enum';
import {Filters} from '../../../../core/components/filters/filters';
import {SortType} from '../../../../core/components/sorts/sort-type.enum';
import {Sorts} from '../../../../core/components/sorts/sorts';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {EventsService} from '../../../../core/services/events.service';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-creature-conditions',
  templateUrl: './creature-conditions.component.html',
  styleUrls: ['./creature-conditions.component.scss']
})
export class CreatureConditionsComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() columnIndex: number;

  currentCondition: Condition = null;
  conditions: ListObject[] = [];

  filterType = FilterType.CONDITION;
  filters: Filters;
  sortType = SortType.CONDITION;
  sorts: Sorts;
  eventSub: Subscription;

  constructor(
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private conditionService: ConditionService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.filters = null;
    this.sorts = this.creatureService.getSorts(this.creature, this.sortType);

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.FetchConditionsList) {
        this.fetchConditions();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  isActive(condition: ListObject): boolean {
    return this.creatureService.isConditionActive(condition, this.creature);
  }

  isImmune(condition: ListObject): boolean {
    return this.creatureService.isConditionImmune(condition, this.creature);
  }

  conditionClick(conditionListObject: ListObject): void {
    if (conditionListObject.id === '0') {
      return;
    }
    this.currentCondition = null;
    setTimeout(() => {
      this.conditionService.getCondition(conditionListObject.id).then((condition: Condition) => {
        this.currentCondition = condition;
      });
    });
  }

  conditionDetailsClose(): void {
    this.currentCondition = null;
  }

  applyFilters(filters: Filters): void {
    this.creatureService.updateFilters(this.creature, this.filterType, filters).then(() => {
      this.filters = filters;
      this.eventsService.dispatchEvent(EVENTS.FetchConditionsList);
    });
  }

  applySort(sorts: Sorts): void {
    this.creatureService.updateSorts(this.creature, this.sortType, sorts).then(() => {
      this.sorts = sorts;
      this.eventsService.dispatchEvent(EVENTS.FetchConditionsList);
    });
  }

  private fetchConditions(): void {
    this.filters = null;
    this.sorts = this.creatureService.getSorts(this.creature, this.sortType);
    this.conditionService.getFilteredConditions(this.filters, this.sorts).then((conditions: ListObject[]) => {
      this.creature.conditions = conditions;
    });
  }
}
