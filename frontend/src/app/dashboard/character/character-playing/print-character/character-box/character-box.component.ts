import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-character-box',
  templateUrl: './character-box.component.html',
  styleUrls: ['./character-box.component.scss']
})
export class CharacterBoxComponent {
  @Input() label: string;
  @Input() value: string|number;

  constructor() { }
}
