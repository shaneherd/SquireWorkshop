import {Component, Input} from '@angular/core';
import {CasterType} from '../../../../shared/models/attributes/caster-type';

@Component({
  selector: 'app-caster-type-details',
  templateUrl: './caster-type-details.component.html',
  styleUrls: ['./caster-type-details.component.scss']
})
export class CasterTypeDetailsComponent {
  @Input() casterType: CasterType;

  constructor() { }
}
