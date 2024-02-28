import {Component, Input} from '@angular/core';
import {DamageType} from '../../../../shared/models/attributes/damage-type';

@Component({
  selector: 'app-damage-type-details',
  templateUrl: './damage-type-details.component.html',
  styleUrls: ['./damage-type-details.component.scss']
})
export class DamageTypeDetailsComponent {
  @Input() damageType: DamageType;

  constructor() { }
}
