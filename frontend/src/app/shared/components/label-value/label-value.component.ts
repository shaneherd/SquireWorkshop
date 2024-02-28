import {Component, Input} from '@angular/core';
import {LabelValue} from '../../models/label-value';

@Component({
  selector: 'app-label-value',
  templateUrl: './label-value.component.html',
  styleUrls: ['./label-value.component.scss']
})
export class LabelValueComponent {
  @Input() labelValue: LabelValue;

  constructor() { }

}
