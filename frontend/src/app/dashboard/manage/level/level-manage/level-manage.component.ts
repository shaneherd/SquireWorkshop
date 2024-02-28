import {Component} from '@angular/core';
import {AttributeService} from '../../../../core/services/attributes/attribute.service';
import {CharacterLevelService} from '../../../../core/services/character-level.service';

@Component({
  selector: 'app-level-manage',
  templateUrl: './level-manage.component.html',
  styleUrls: ['./level-manage.component.scss']
})
export class LevelManageComponent {

  constructor(
    public characterLevelService: CharacterLevelService,
    public attributeService: AttributeService) { }

}
