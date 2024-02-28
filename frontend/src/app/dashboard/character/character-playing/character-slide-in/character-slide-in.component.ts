import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-character-slide-in',
  templateUrl: './character-slide-in.component.html',
  styleUrls: ['./character-slide-in.component.scss']
})
export class CharacterSlideInComponent {
  @Input() loading: boolean;
  @Input() itemName: string;

  constructor() { }

}
