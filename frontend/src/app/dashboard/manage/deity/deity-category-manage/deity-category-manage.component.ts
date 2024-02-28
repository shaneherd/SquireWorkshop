import {Component} from '@angular/core';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {DeityCategoryService} from '../../../../core/services/attributes/deity-category.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';

@Component({
  selector: 'app-deity-category-manage',
  templateUrl: './deity-category-manage.component.html',
  styleUrls: ['./deity-category-manage.component.scss']
})
export class DeityCategoryManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public deityCategoryService: DeityCategoryService,
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
