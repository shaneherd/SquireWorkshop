import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from '../../models/tag';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() tag: Tag;
  @Input() displayTooltip = false;
  @Output() tagClick = new EventEmitter();

  tooltip = '';

  constructor() { }

  ngOnInit() {
    if (this.displayTooltip) {
      this.tooltip = this.tag.title;
    }
  }

  onTagClick(event: MouseEvent): void {
    event.stopPropagation();
    this.tagClick.emit(this.tag);
  }

}
