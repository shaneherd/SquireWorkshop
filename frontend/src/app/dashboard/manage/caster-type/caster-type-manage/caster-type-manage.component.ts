import {Component} from '@angular/core';
import {CasterTypeService} from '../../../../core/services/attributes/caster-type.service';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportAttributeService} from '../../../../core/services/export/export-attribute.service';

@Component({
  selector: 'app-caster-type-manage',
  templateUrl: './caster-type-manage.component.html',
  styleUrls: ['./caster-type-manage.component.scss']
})
export class CasterTypeManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public casterTypeService: CasterTypeService,
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
