import {Component} from '@angular/core';
import {CharacteristicService} from '../../../../core/services/characteristics/characteristic.service';
import {CharacterClassService} from '../../../../core/services/characteristics/character-class.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportCharacteristicService} from '../../../../core/services/export/export-characteristic.service';

@Component({
  selector: 'app-class-manage',
  templateUrl: './class-manage.component.html',
  styleUrls: ['./class-manage.component.scss']
})
export class ClassManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public characterClassService: CharacterClassService,
    public characteristicService: CharacteristicService,
    public exportService: ExportCharacteristicService) { }

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
