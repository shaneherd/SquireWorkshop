import {Component, Input} from '@angular/core';
import {Characteristic} from '../../../../shared/models/characteristics/characteristic';

@Component({
  selector: 'app-characteristic-details',
  templateUrl: './characteristic-details.component.html',
  styleUrls: ['./characteristic-details.component.scss']
})
export class CharacteristicDetailsComponent {
  @Input() characteristic: Characteristic;

  constructor() { }
}
