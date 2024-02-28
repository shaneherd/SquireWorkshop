import {Component, Input} from '@angular/core';
import {Race} from '../../../../shared/models/characteristics/race';

@Component({
  selector: 'app-race-details',
  templateUrl: './race-details.component.html',
  styleUrls: ['./race-details.component.scss']
})
export class RaceDetailsComponent {
  @Input() race: Race;

  constructor() { }
}
