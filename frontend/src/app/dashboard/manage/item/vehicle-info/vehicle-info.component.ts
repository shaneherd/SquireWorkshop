import {Component, Input} from '@angular/core';
import {Vehicle} from '../../../../shared/models/items/vehicle';

@Component({
  selector: 'app-vehicle-info',
  templateUrl: './vehicle-info.component.html',
  styleUrls: ['./vehicle-info.component.scss']
})
export class VehicleInfoComponent {
  @Input() vehicle: Vehicle;
  @Input() editing: boolean;

  constructor() { }

}
