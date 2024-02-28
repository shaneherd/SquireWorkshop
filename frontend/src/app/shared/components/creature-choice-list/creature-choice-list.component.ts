import {Component, Input} from '@angular/core';
import {CreatureListProficiency} from '../../models/creatures/creature-list-proficiency';
import {CreatureChoiceProficiency} from '../../models/creatures/configs/creature-choice-proficiency';

@Component({
  selector: 'app-creature-choice-list',
  templateUrl: './creature-choice-list.component.html',
  styleUrls: ['./creature-choice-list.component.scss']
})
export class CreatureChoiceListComponent {
  @Input() profs: CreatureListProficiency[];
  @Input() choices: CreatureChoiceProficiency[];
  @Input() checkParent = false;

  constructor() { }

}
