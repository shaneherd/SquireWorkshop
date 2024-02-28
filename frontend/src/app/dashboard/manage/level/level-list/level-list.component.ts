import {Component} from '@angular/core';
import {CharacterLevelService} from '../../../../core/services/character-level.service';

@Component({
  selector: 'app-level-list',
  templateUrl: './level-list.component.html',
  styleUrls: ['./level-list.component.scss']
})
export class LevelListComponent {
  loading = true;

  constructor(
    public characterLevelService: CharacterLevelService
  ) { }
}
