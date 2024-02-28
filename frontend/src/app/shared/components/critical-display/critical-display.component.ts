import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-critical-display',
  templateUrl: './critical-display.component.html',
  styleUrls: ['./critical-display.component.scss']
})
export class CriticalDisplayComponent {
  @Input() critical = false;

  constructor() { }

}
