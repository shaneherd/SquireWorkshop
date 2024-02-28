import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-speed-display',
  templateUrl: './speed-display.component.html',
  styleUrls: ['./speed-display.component.scss']
})
export class SpeedDisplayComponent {
  @Input() speed: number;

  constructor() { }

}
