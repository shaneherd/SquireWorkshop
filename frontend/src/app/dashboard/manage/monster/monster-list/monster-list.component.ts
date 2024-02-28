import {Component} from '@angular/core';
import {MonsterService} from '../../../../core/services/creatures/monster.service';

@Component({
  selector: 'app-monster-list',
  templateUrl: './monster-list.component.html',
  styleUrls: ['./monster-list.component.scss']
})
export class MonsterListComponent {
  loading = true;

  constructor(
    public monsterService: MonsterService
  ) { }
}
