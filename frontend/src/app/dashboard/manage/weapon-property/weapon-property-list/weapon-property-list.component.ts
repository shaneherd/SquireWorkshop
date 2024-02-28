import {Component} from '@angular/core';
import {WeaponPropertyService} from '../../../../core/services/attributes/weapon-property.service';

@Component({
  selector: 'app-weapon-property-list',
  templateUrl: './weapon-property-list.component.html',
  styleUrls: ['./weapon-property-list.component.scss']
})
export class WeaponPropertyListComponent {
  loading = true;

  constructor(
    public weaponPropertyService: WeaponPropertyService
  ) { }
}
