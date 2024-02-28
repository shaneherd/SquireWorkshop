import {Component} from '@angular/core';
import {CharacteristicService} from '../../../../core/services/characteristics/characteristic.service';
import {RaceService} from '../../../../core/services/characteristics/race.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportCharacteristicService} from '../../../../core/services/export/export-characteristic.service';

@Component({
  selector: 'app-race-manage',
  templateUrl: './race-manage.component.html',
  styleUrls: ['./race-manage.component.scss']
})
export class RaceManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public raceService: RaceService,
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
