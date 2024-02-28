import {Component, Input} from '@angular/core';
import {ToolCategory} from '../../../../shared/models/attributes/tool-category';

@Component({
  selector: 'app-tool-category-details',
  templateUrl: './tool-category-details.component.html',
  styleUrls: ['./tool-category-details.component.scss']
})
export class ToolCategoryDetailsComponent {
  @Input() toolCategory: ToolCategory;

  constructor() { }
}
