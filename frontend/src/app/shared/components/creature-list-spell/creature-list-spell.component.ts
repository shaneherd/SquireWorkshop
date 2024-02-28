import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SpellListObject} from '../../models/powers/spell-list-object';

@Component({
  selector: 'app-creature-list-spell',
  templateUrl: './creature-list-spell.component.html',
  styleUrls: ['./creature-list-spell.component.scss']
})
export class CreatureListSpellComponent {
  @Input() spell: SpellListObject;
  @Input() clickDisabled = false;
  @Output() spellClick = new EventEmitter();

  constructor() { }

  onSpellClick(): void {
    if (!this.clickDisabled) {
      this.spellClick.emit(this.spell);
    }
  }
}
