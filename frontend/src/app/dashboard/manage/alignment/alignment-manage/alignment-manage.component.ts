import {Component} from '@angular/core';
import {AlignmentService} from '../../../../core/services/attributes/alignment.service';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';

@Component({
  selector: 'app-alignment-manage',
  templateUrl: './alignment-manage.component.html',
  styleUrls: ['./alignment-manage.component.scss']
})
export class AlignmentManageComponent {
  alignment: MenuItem = null;

  constructor(
    public alignmentService: AlignmentService,
    public attributeService: AttributeService
  ) { }

  onItemClick(menuItem: MenuItem): void {
    this.alignment = menuItem;
  }

  updateSelected(menuItem: MenuItem): void {
    menuItem.selected = !menuItem.selected;
    this.alignment = null;
  }

  closeItem(): void {
    this.alignment = null;
  }

}
