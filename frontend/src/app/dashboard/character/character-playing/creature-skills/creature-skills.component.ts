import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CreatureSkillListProficiency} from '../../../../shared/models/creatures/creature-skill-list-proficiency';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {FilterType} from '../../../../core/components/filters/filter-type.enum';
import {Filters} from '../../../../core/components/filters/filters';
import {SortType} from '../../../../core/components/sorts/sort-type.enum';
import {Sorts} from '../../../../core/components/sorts/sorts';
import {ListObject} from '../../../../shared/models/list-object';
import {FilterSorts} from '../../../../shared/models/filter-sorts';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {EventsService} from '../../../../core/services/events.service';
import {EVENTS} from '../../../../constants';
import {Subscription} from 'rxjs';
import {Creature} from '../../../../shared/models/creatures/creature';
import {CreatureType} from '../../../../shared/models/creatures/creature-type.enum';

@Component({
  selector: 'app-creature-skills',
  templateUrl: './creature-skills.component.html',
  styleUrls: ['./creature-skills.component.scss']
})
export class CreatureSkillsComponent implements OnInit, OnDestroy {
  @Input() creature: Creature;
  @Input() collection: CreatureConfigurationCollection;
  @Input() columnIndex: number;

  playerCharacter: PlayerCharacter = null;
  configuringSkill: CreatureSkillListProficiency = null;

  filterType = FilterType.SKILL;
  filters: Filters;
  sortType = SortType.SKILL;
  sorts: Sorts;

  skills: CreatureSkillListProficiency[] = [];
  eventSub: Subscription;

  viewingSettings = false;
  clickDisabled = false;

  constructor(
    private creatureService: CreatureService,
    private characterService: CharacterService,
    private attributeService: AttributeService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.filters = null;
    this.sorts = this.creatureService.getSorts(this.creature, this.sortType);
    this.initializeSkills();

    if (this.creature != null && this.creature.creatureType === CreatureType.CHARACTER) {
      this.playerCharacter = this.creature as PlayerCharacter;
    }

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.FetchSkillList) {
        this.fetchSkills();
      } else if (event === (EVENTS.MenuAction.SkillSettings + this.columnIndex)) {
        this.settingsClick();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeSkills(): void {
    this.skills = [];
    this.creature.skills.forEach((skill: ListObject) => {
      const skillProf = this.getSkill(skill.id);
      if (skillProf != null) {
        this.skills.push(skillProf);
      }
    });
  }

  private getSkill(id: string): CreatureSkillListProficiency {
    for (let i = 0; i < this.collection.proficiencyCollection.skillProficiencies.length; i++) {
      const skill = this.collection.proficiencyCollection.skillProficiencies[i];
      if (skill.skill != null && skill.skill.id === id) {
        return skill;
      }
    }
    return null;
  }

  skillClick(skill: CreatureSkillListProficiency): void {
    if (this.configuringSkill == null) {
      this.configuringSkill = skill;
    }
  }

  configurationClose(): void {
    this.configuringSkill = null;
  }

  applyFilters(filters: Filters): void {
    this.creatureService.updateFilters(this.creature, this.filterType, filters).then(() => {
      this.filters = filters;
      this.eventsService.dispatchEvent(EVENTS.FetchSkillList);
    });
  }

  applySort(sorts: Sorts): void {
    this.creatureService.updateSorts(this.creature, this.sortType, sorts).then(() => {
      this.sorts = sorts;
      this.eventsService.dispatchEvent(EVENTS.FetchSkillList);
    });
  }

  private fetchSkills(): void {
    this.filters = null;
    this.sorts = this.creatureService.getSorts(this.creature, SortType.SKILL);
    const filterSorts = new FilterSorts(this.filters, this.sorts);
    this.attributeService.getFilteredSkills(filterSorts).then((skills: ListObject[]) => {
      this.creature.skills = skills;
      this.initializeSkills();
    });
  }

  private settingsClick(): void {
    this.viewingSettings = true;
    this.updateClickDisabled();
  }

  saveSettings(): void {
    this.viewingSettings = false;
    this.updateClickDisabled();
  }

  closeSettings(): void {
    this.viewingSettings = false;
    this.updateClickDisabled();
  }

  private updateClickDisabled(): void {
    this.clickDisabled = this.viewingSettings;
  }
}
