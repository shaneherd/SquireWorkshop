import {Component} from '@angular/core';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {ToolCategoryService} from '../../../../core/services/attributes/tool-category.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';

@Component({
  selector: 'app-tool-category-manage',
  templateUrl: './tool-category-manage.component.html',
  styleUrls: ['./tool-category-manage.component.scss']
})
export class ToolCategoryManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public toolCategoryService: ToolCategoryService,
    public attributeService: AttributeService) { }

  onItemClick(menuItem: MenuItem): void {
    this.selectedItem = menuItem;
  }

  updateSelected(menuItem: MenuItem): void {
    menuItem.selected = !menuItem.selected;
    this.selectedItem = null;
  }

  closeItem(): void {
    this.selectedItem = null;
  }

}
