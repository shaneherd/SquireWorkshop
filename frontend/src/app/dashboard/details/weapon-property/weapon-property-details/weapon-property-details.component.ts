import {Component, Input} from '@angular/core';
import {WeaponProperty} from '../../../../shared/models/attributes/weapon-property';

@Component({
  selector: 'app-weapon-property-details',
  templateUrl: './weapon-property-details.component.html',
  styleUrls: ['./weapon-property-details.component.scss']
})
export class WeaponPropertyDetailsComponent {
  @Input() weaponProperty: WeaponProperty;

  constructor() { }
}
