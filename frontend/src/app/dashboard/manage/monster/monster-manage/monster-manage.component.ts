import {Component} from '@angular/core';
import {MonsterService} from '../../../../core/services/creatures/monster.service';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {ExportMonsterService} from '../../../../core/services/export/export-monster.service';

@Component({
  selector: 'app-monster-manage',
  templateUrl: './monster-manage.component.html',
  styleUrls: ['./monster-manage.component.scss']
})
export class MonsterManageComponent {
  selectedItem: MenuItem = null;

  constructor(
    public monsterService: MonsterService,
    public exportService: ExportMonsterService
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
