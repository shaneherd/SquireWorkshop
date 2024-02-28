import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-print-character-prof',
  templateUrl: './print-character-prof.component.html',
  styleUrls: ['./print-character-prof.component.scss']
})
export class PrintCharacterProfComponent {
  @Input() label: string;
  @Input() value: string;
  @Input() proficient: boolean;

  constructor() { }
}
