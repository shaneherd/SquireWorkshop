import {Component} from '@angular/core';
import {BackgroundService} from '../../../../core/services/characteristics/background.service';

@Component({
  selector: 'app-background-list',
  templateUrl: './background-list.component.html',
  styleUrls: ['./background-list.component.scss']
})
export class BackgroundListComponent {
  loading = true;

  constructor(
    public backgroundService: BackgroundService,
  ) { }
}
