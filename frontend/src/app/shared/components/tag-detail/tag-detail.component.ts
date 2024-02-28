import {Component, Input} from '@angular/core';
import {Tag} from '../../models/tag';

@Component({
  selector: 'app-tag-detail',
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.scss']
})
export class TagDetailComponent {
  @Input() tag: Tag;

  constructor() { }

}
