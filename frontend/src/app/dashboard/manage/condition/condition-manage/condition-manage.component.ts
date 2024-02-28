import {Component} from '@angular/core';
import {ConditionService} from '../../../../core/services/attributes/condition.service';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportAttributeService} from '../../../../core/services/export/export-attribute.service';

@Component({
  selector: 'app-condition-manage',
  templateUrl: './condition-manage.component.html',
  styleUrls: ['./condition-manage.component.scss']
})
export class ConditionManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public conditionService: ConditionService,
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
