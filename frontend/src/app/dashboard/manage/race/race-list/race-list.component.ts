import {Component} from '@angular/core';
import {RaceService} from '../../../../core/services/characteristics/race.service';

@Component({
  selector: 'app-race-list',
  templateUrl: './race-list.component.html',
  styleUrls: ['./race-list.component.scss']
})
export class RaceListComponent {
  loading = true;

  constructor(
    public raceService: RaceService
  ) { }
}
