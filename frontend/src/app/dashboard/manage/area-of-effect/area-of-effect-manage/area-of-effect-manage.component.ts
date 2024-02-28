import {Component} from '@angular/core';
import {AreaOfEffectService} from '../../../../core/services/attributes/area-of-effect.service';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';

@Component({
  selector: 'app-area-of-effect-manage',
  templateUrl: './area-of-effect-manage.component.html',
  styleUrls: ['./area-of-effect-manage.component.scss']
})
export class AreaOfEffectManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public areaOfEffectService: AreaOfEffectService,
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
