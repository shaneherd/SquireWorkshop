import {Component} from '@angular/core';
import {BackgroundService} from '../../../../core/services/characteristics/background.service';
import {CharacteristicService} from '../../../../core/services/characteristics/characteristic.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportCharacteristicService} from '../../../../core/services/export/export-characteristic.service';

@Component({
  selector: 'app-background-manage',
  templateUrl: './background-manage.component.html',
  styleUrls: ['./background-manage.component.scss']
})
export class BackgroundManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public backgroundService: BackgroundService,
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
