import {Component, Input, OnInit} from '@angular/core';
import {Tool} from '../../../../shared/models/items/tool';
import {ToolCategoryService} from '../../../../core/services/attributes/tool-category.service';
import {ListObject} from '../../../../shared/models/list-object';
import {ToolCategory} from '../../../../shared/models/attributes/tool-category';

@Component({
  selector: 'app-tool-info',
  templateUrl: './tool-info.component.html',
  styleUrls: ['./tool-info.component.scss']
})
export class ToolInfoComponent implements OnInit {
  @Input() tool: Tool;
  @Input() editing: boolean;

  categories: ListObject[] = [];
  selectedCategory: ListObject = new ListObject('0', '');

  constructor(
    private toolCategoryService: ToolCategoryService
  ) { }

  ngOnInit() {
    this.initializeCategories();
  }

  initializeCategories(): void {
    this.toolCategoryService.getToolCategories().then((categories: ListObject[]) => {
      this.categories = categories;
      this.initializedSelectedCategory();
    });
  }

  initializedSelectedCategory(): void {
    if (this.tool.category != null) {
      for (let i = 0; i < this.categories.length; i++) {
        const category: ListObject = this.categories[i];
        if (category.id === this.tool.category.id) {
          this.selectedCategory = category;
          return;
        }
      }
    }
    if (this.editing && this.categories.length > 0) {
      this.selectedCategory = this.categories[0];
      this.tool.category = new ToolCategory();
      this.tool.category.id = this.selectedCategory.id;
      this.tool.category.name = this.selectedCategory.name;
      this.tool.category.description = this.selectedCategory.description;
    }
  }

  categoryChange(value: ListObject): void {
    this.selectedCategory = value;
    this.tool.category.id = this.selectedCategory.id;
    this.tool.category.name = this.selectedCategory.name;
    this.tool.category.description = this.selectedCategory.description;
  }
}
