import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-print-character-list-item',
  templateUrl: './print-character-list-item.component.html',
  styleUrls: ['./print-character-list-item.component.scss']
})
export class PrintCharacterListItemComponent {
  @Input() value: string;

  constructor() { }
}
