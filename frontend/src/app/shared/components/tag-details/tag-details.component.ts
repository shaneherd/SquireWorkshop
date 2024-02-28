import {Component, Input} from '@angular/core';
import {Tag} from '../../models/tag';

@Component({
  selector: 'app-tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.scss']
})
export class TagDetailsComponent {
  @Input() tags: Tag[] = [];

  constructor() { }

}
