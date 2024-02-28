import {Component, Input, OnInit} from '@angular/core';
import {Tag} from '../../models/tag';
import {BarTagService} from '../../../core/services/bar-tag.service';
import {BarTagConfiguration} from '../../models/bar-tag-configuration';

@Component({
  selector: 'app-tag-bar',
  templateUrl: './tag-bar.component.html',
  styleUrls: ['./tag-bar.component.scss']
})
export class TagBarComponent implements OnInit {
  @Input() collection: BarTagConfiguration[];
  @Input() tags: Tag[];
  @Input() allTags: Tag[];

  constructor(
    private barTagService: BarTagService
  ) { }

  ngOnInit() {
    if (this.collection == null) {
      this.collection = this.barTagService.initializeTags(this.tags, this.allTags);
    }
  }
}
