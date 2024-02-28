import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PlayerCharacter} from '../../../../shared/models/creatures/characters/player-character';
import {TranslateService} from '@ngx-translate/core';
import {CharacterNote} from '../../../../shared/models/creatures/characters/character-note';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {CharacterNoteCategory} from '../../../../shared/models/creatures/characters/character-note-category';
import {CharacterService} from '../../../../core/services/creatures/character.service';

@Component({
  selector: 'app-note-configuration-details',
  templateUrl: './note-configuration-details.component.html',
  styleUrls: ['./note-configuration-details.component.scss']
})
export class NoteConfigurationDetailsComponent implements OnInit {
  @Input() playerCharacter: PlayerCharacter;
  @Input() deletable = false;
  @Input() note: CharacterNote;
  @Output() save = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() close = new EventEmitter();
  headerName = '';

  noteValue = '';
  category = '0';
  other = false;
  otherName = '';
  categories: CharacterNoteCategory[] = [];

  constructor(
    private translate: TranslateService,
    private characterService: CharacterService,
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.noteValue = this.note.note;
    this.headerName = this.deletable ? this.translate.instant('EditNote') : this.translate.instant('AddNote');
    this.categories = this.characterService.getNoteCategories(this.playerCharacter, true, true);
    this.initializeCategory();
  }

  private initializeCategory(): void {
    if (this.note.characterNoteCategory == null || this.note.characterNoteCategory.id === '0') {
      this.category = this.categories[0].id;
    } else {
      const category = this.getCategory(this.note.characterNoteCategory.id);
      if (category == null) {
        this.category = this.categories[0].id;
      } else {
        this.category = category.id;
      }
    }
  }

  private getCategory(id: string): CharacterNoteCategory {
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id === id) {
        return this.categories[i];
      }
    }
    return null;
  }

  categoryChange(categoryId: string): void {
    const category = this.getCategory(categoryId);
    this.category = category.id;
    this.other = category.name === 'Other';
  }

  private getNewCategory(): CharacterNoteCategory {
    if (this.category === '0' || (this.category === '-1' && this.otherName === '')) {
      return null;
    } else if (this.category === '-1') {
      const category = new CharacterNoteCategory();
      category.id = '0';
      category.name = this.otherName;
      return category;
    } else {
      return this.getCategory(this.category);
    }
  }

  saveNote(): void {
    this.note.characterNoteCategory = this.getNewCategory();
    this.note.note = this.noteValue;
    if (this.note.id === '0') {
      this.creatureService.addNote(this.playerCharacter, this.note).then((note: CharacterNote) => {
        this.note = note;
        this.playerCharacter.characterNotes.push(this.note);
        this.save.emit();
      });
    } else {
      this.creatureService.updateNote(this.playerCharacter, this.note).then((note: CharacterNote) => {
        this.note = note;
        const index = this.getNoteIndex();
        if (index > -1) {
          this.playerCharacter.characterNotes.splice(index, 1, this.note);
        }
        this.save.emit();
      });
    }
  }

  deleteNote(): void {
    if (this.deletable) {
      this.creatureService.deleteNote(this.playerCharacter, this.note).then(() => {
        const index = this.getNoteIndex();
        if (index > -1) {
          this.playerCharacter.characterNotes.splice(index, 1);
        }
        this.delete.emit();
      });
    } else {
      this.delete.emit();
    }
  }

  private getNoteIndex(): number {
    for (let i = 0; i < this.playerCharacter.characterNotes.length; i++) {
      if (this.playerCharacter.characterNotes[i].id === this.note.id) {
        return i;
      }
    }
    return -1;
  }

  closeNote(): void {
    this.close.emit();
  }

}
