import {Component} from '@angular/core';
import {ToolCategoryService} from '../../../../core/services/attributes/tool-category.service';

@Component({
  selector: 'app-tool-category-list',
  templateUrl: './tool-category-list.component.html',
  styleUrls: ['./tool-category-list.component.scss']
})
export class ToolCategoryListComponent {
  loading = true;

  constructor(
    public toolCategoriesService: ToolCategoryService
  ) { }
}
