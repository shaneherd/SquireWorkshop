import {Component, Input} from '@angular/core';
import {Deity} from '../../../../shared/models/attributes/deity';

@Component({
  selector: 'app-deity-details',
  templateUrl: './deity-details.component.html',
  styleUrls: ['./deity-details.component.scss']
})
export class DeityDetailsComponent {
  @Input() deity: Deity;

  constructor() { }
}
