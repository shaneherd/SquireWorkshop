import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from '../../../../shared/models/tag';
import * as _ from 'lodash';
import {ColorEvent} from 'ngx-color';

@Component({
  selector: 'app-tag-color-configuration-slide-in',
  templateUrl: './tag-color-configuration-slide-in.component.html',
  styleUrls: ['./tag-color-configuration-slide-in.component.scss']
})
export class TagColorConfigurationSlideInComponent implements OnInit {
  @Input() tag: Tag;
  @Output() apply = new EventEmitter();
  @Output() close = new EventEmitter();

  editingTag: Tag = null;
  presetColors: string[] = [];

  constructor() { }

  ngOnInit() {
    this.editingTag = _.cloneDeep(this.tag);
    this.presetColors = [
      '#992416',
      '#f9792f',
      '#f4d442',
      '#157a12',
      '#2032d6',
      '#6af2ed',
      '#8e2bc4',
      '#f92fa8',
      '#929292',
      '#000000'
    ];
  }

  applyClick(): void {
    this.tag.color = this.editingTag.color;
    this.apply.emit();
  }

  closeClick(): void {
    this.close.emit();
  }

  changeComplete(event: ColorEvent): void {
    this.editingTag.color = event.color.hex.replace('#', '');
  }

}
