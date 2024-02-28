import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-print-character-checkbox',
  templateUrl: './print-character-checkbox.component.html',
  styleUrls: ['./print-character-checkbox.component.scss']
})
export class PrintCharacterCheckboxComponent {
  @Input() checked: boolean;

  constructor() { }
}
