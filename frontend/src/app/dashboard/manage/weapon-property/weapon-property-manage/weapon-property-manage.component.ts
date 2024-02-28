import {Component} from '@angular/core';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {WeaponPropertyService} from '../../../../core/services/attributes/weapon-property.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportAttributeService} from '../../../../core/services/export/export-attribute.service';

@Component({
  selector: 'app-weapon-property-manage',
  templateUrl: './weapon-property-manage.component.html',
  styleUrls: ['./weapon-property-manage.component.scss']
})
export class WeaponPropertyManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public weaponPropertyService: WeaponPropertyService,
    public attributeService: AttributeService,
    public exportService: ExportAttributeService) { }

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
