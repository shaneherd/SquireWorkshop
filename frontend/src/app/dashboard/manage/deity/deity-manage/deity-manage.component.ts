import {Component} from '@angular/core';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {DeityService} from '../../../../core/services/attributes/deity.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';

@Component({
  selector: 'app-deity-manage',
  templateUrl: './deity-manage.component.html',
  styleUrls: ['./deity-manage.component.scss']
})
export class DeityManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public deityService: DeityService,
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
