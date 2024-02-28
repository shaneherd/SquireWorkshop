import {Component} from '@angular/core';
import {CharacterClassService} from '../../../../core/services/characteristics/character-class.service';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent {
  loading = true;

  constructor(
    public characterClassService: CharacterClassService
  ) { }
}
