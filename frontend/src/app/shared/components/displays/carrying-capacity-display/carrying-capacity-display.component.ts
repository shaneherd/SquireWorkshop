import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-carrying-capacity-display',
  templateUrl: './carrying-capacity-display.component.html',
  styleUrls: ['./carrying-capacity-display.component.scss']
})
export class CarryingCapacityDisplayComponent {
  @Input() carryingCapacity: number;

  constructor() { }

}
