import {Component, Input} from '@angular/core';
import {Gear} from '../../../../shared/models/items/gear';

@Component({
  selector: 'app-gear-info',
  templateUrl: './gear-info.component.html',
  styleUrls: ['./gear-info.component.scss']
})
export class GearInfoComponent {
  @Input() gear: Gear;
  @Input() editing: boolean;

  constructor() { }

}
