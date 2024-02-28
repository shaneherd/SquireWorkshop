import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {CreatureConfigurationCollection} from '../../../../shared/models/creatures/configs/creature-configuration-collection';
import {CharacterNote} from '../../../../shared/models/creatures/characters/character-note';
import {FilterType} from '../../../../core/components/filters/filter-type.enum';
import {Filters} from '../../../../core/components/filters/filters';
import {SortType} from '../../../../core/components/sorts/sort-type.enum';
import {Sorts} from '../../../../core/components/sorts/sorts';
import {CharacterService} from '../../../../core/services/creatures/character.service';
import {FilterSorts} from '../../../../shared/models/filter-sorts';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {Subscription} from 'rxjs';
import {EVENTS} from '../../../../constants';
import {EventsService} from '../../../../core/services/events.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {CharacterNoteCategory} from '../../../../shared/models/creatures/characters/character-note-category';

export class CharacterNoteDisplay {
  category: CharacterNoteCategory;
  notes: CharacterNote[] = [];
}

@Component({
  selector: 'app-character-notes',
  templateUrl: './character-notes.component.html',
  styleUrls: ['./character-notes.component.scss']
})
export class CharacterNotesComponent implements OnInit, OnDestroy {
  @Input() playerCharacter: PlayerCharacter;
  @Input() collection: CreatureConfigurationCollection;
  @Input() columnIndex: number;

  eventSub: Subscription;
  configuringNote: CharacterNote;
  notes = new Map<string, CharacterNoteDisplay>();

  filterType = FilterType.NOTE;
  filters: Filters;
  sortType = SortType.NOTE;
  sorts: Sorts;

  constructor(
    private characterService: CharacterService,
    private creatureService: CreatureService,
    private eventsService: EventsService
  ) { }

  ngOnInit() {
    this.initializeNotes();
    this.filters = null;
    this.sorts = this.creatureService.getSorts(this.playerCharacter, this.sortType);

    this.eventSub = this.eventsService.events.subscribe(event => {
      if (event === EVENTS.FetchNotesList) {
        this.fetchNotes();
      } else if (event === EVENTS.MenuAction.AddNote + this.columnIndex) {
        this.addNote();
      }
    });
  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

  private initializeNotes(): void {
    const notesMap = new Map<string, CharacterNoteDisplay>();
    this.playerCharacter.characterNotes.forEach((note: CharacterNote) => {
      let category = note.characterNoteCategory;
      if (category == null) {
        category = new CharacterNoteCategory();
      }
      let categoryName = '';
      if (category != null && category.id !== '0') {
        categoryName = category.name;
      }
      let characterNoteDisplay = notesMap.get(categoryName);
      if (characterNoteDisplay == null) {
        characterNoteDisplay = new CharacterNoteDisplay();
        characterNoteDisplay.category = category;
        notesMap.set(categoryName, characterNoteDisplay);
      }
      characterNoteDisplay.notes.push(note);
    });
    this.notes = notesMap;
  }

  noteClick(note: CharacterNote): void {
    this.configuringNote = note;
  }

  addNote(): void {
    this.configuringNote = new CharacterNote();
  }

  saveNote(): void {
    this.configuringNote = null;
    this.eventsService.dispatchEvent(EVENTS.FetchNotesList);
  }

  deleteNote(): void {
    this.configuringNote = null;
    this.eventsService.dispatchEvent(EVENTS.FetchNotesList);
  }

  closeDetails(): void {
    this.configuringNote = null;
  }

  applyFilters(filters: Filters): void {
    this.creatureService.updateFilters(this.playerCharacter, this.filterType, filters).then(() => {
      this.filters = filters;
      this.eventsService.dispatchEvent(EVENTS.FetchNotesList);
    });
  }

  applySort(sorts: Sorts): void {
    this.creatureService.updateSorts(this.playerCharacter, this.sortType, sorts).then(() => {
      this.sorts = sorts;
      this.eventsService.dispatchEvent(EVENTS.FetchNotesList);
    });
  }

  private fetchNotes(): void {
    this.filters = null;
    this.sorts = this.creatureService.getSorts(this.playerCharacter, this.sortType);
    const filterSorts = new FilterSorts(this.filters, this.sorts);
    this.creatureService.getNotes(this.playerCharacter, filterSorts).then((notes: CharacterNote[]) => {
      this.playerCharacter.characterNotes = notes;
      this.initializeNotes();
    });
  }

  drop(event: CdkDragDrop<string[]>, list: any) {
    moveItemInArray(list.value.notes, event.previousIndex, event.currentIndex);
    this.creatureService.updateNoteOrder(this.playerCharacter, list.value.notes);
  }

  toggleExpanded(characterNoteDisplay: CharacterNoteDisplay): void {
    characterNoteDisplay.category.expanded = !characterNoteDisplay.category.expanded;
    this.creatureService.updateNoteCategory(this.playerCharacter, characterNoteDisplay.category);
  }
}
