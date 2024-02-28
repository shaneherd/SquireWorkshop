import {Component, Input} from '@angular/core';
import {Alignment} from '../../../../shared/models/attributes/alignment';

@Component({
  selector: 'app-alignment-details',
  templateUrl: './alignment-details.component.html',
  styleUrls: ['./alignment-details.component.scss']
})
export class AlignmentDetailsComponent {
  @Input() alignment: Alignment;

  constructor() { }
}
