import {Component, Input} from '@angular/core';
import {Proficiency} from '../../models/proficiency';

@Component({
  selector: 'app-proficiency-display',
  templateUrl: './proficiency-display.component.html',
  styleUrls: ['./proficiency-display.component.scss']
})
export class ProficiencyDisplayComponent {
  @Input() proficiency: Proficiency = new Proficiency();
  @Input() inherited = false;

  constructor() { }

}
