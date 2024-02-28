import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CharacterBackgroundTraitCollectionItem} from '../../../shared/models/creatures/characters/configs/character-background-trait-collection-item';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-character-edit-background-trait-choice-category',
  templateUrl: './character-edit-background-trait-choice-category.component.html',
  styleUrls: ['./character-edit-background-trait-choice-category.component.scss']
})
export class CharacterEditBackgroundTraitChoiceCategoryComponent {
  @Input() traits: CharacterBackgroundTraitCollectionItem[] = [];
  @Input() customTrait = '';
  @Output() customTraitChange = new EventEmitter();

  constructor() { }

  traitChange(event: MatCheckboxChange, trait: CharacterBackgroundTraitCollectionItem): void {
    trait.selected = event.checked;
  }

  onCustomTraitChange(input): void {
    this.customTrait = input.target.value;
    if (this.customTraitChange != null) {
      this.customTraitChange.emit(this.customTrait);
    }
  }

}
