import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-print-character-list-spell',
  templateUrl: './print-character-list-spell.component.html',
  styleUrls: ['./print-character-list-spell.component.scss']
})
export class PrintCharacterListSpellComponent {
  @Input() spellName: string;
  @Input() prepared: boolean;
  @Input() showPrepared = true;

  constructor() { }
}
