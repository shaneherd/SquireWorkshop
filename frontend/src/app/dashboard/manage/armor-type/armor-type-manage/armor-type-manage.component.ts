import {Component} from '@angular/core';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {ArmorTypeService} from '../../../../core/services/attributes/armor-type.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportAttributeService} from '../../../../core/services/export/export-attribute.service';

@Component({
  selector: 'app-armor-type-manage',
  templateUrl: './armor-type-manage.component.html',
  styleUrls: ['./armor-type-manage.component.scss']
})
export class ArmorTypeManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public armorTypeService: ArmorTypeService,
    public attributeService: AttributeService,
    public exportService: ExportAttributeService
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
