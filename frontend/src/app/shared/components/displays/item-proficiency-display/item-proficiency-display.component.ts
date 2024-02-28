import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-item-proficiency-display',
  templateUrl: './item-proficiency-display.component.html',
  styleUrls: ['./item-proficiency-display.component.scss']
})
export class ItemProficiencyDisplayComponent {
  @Input() proficient: boolean;

  constructor() { }

}
