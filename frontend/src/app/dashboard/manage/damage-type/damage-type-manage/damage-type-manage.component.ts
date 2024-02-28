import {Component} from '@angular/core';
import {DamageTypeService} from '../../../../core/services/attributes/damage-type.service';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';

@Component({
  selector: 'app-damage-type-manage',
  templateUrl: './damage-type-manage.component.html',
  styleUrls: ['./damage-type-manage.component.scss']
})
export class DamageTypeManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public damageTypeService: DamageTypeService,
    public attributeService: AttributeService
  ) { }

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
