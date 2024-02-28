import {Component} from '@angular/core';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {SkillService} from '../../../../core/services/attributes/skill.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportAttributeService} from '../../../../core/services/export/export-attribute.service';

@Component({
  selector: 'app-skill-manage',
  templateUrl: './skill-manage.component.html',
  styleUrls: ['./skill-manage.component.scss']
})
export class SkillManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public skillService: SkillService,
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
