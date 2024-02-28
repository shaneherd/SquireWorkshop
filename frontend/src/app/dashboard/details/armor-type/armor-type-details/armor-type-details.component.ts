import {Component, Input} from '@angular/core';
import {ArmorType} from '../../../../shared/models/attributes/armor-type';

@Component({
  selector: 'app-armor-type-details',
  templateUrl: './armor-type-details.component.html',
  styleUrls: ['./armor-type-details.component.scss']
})
export class ArmorTypeDetailsComponent {
  @Input() armorType: ArmorType;

  constructor() { }
}
