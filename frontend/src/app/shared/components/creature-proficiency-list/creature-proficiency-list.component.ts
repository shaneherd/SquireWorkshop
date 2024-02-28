import {Component, Input} from '@angular/core';
import {CreatureListProficiency} from '../../models/creatures/creature-list-proficiency';

@Component({
  selector: 'app-creature-proficiency-list',
  templateUrl: './creature-proficiency-list.component.html',
  styleUrls: ['./creature-proficiency-list.component.scss']
})
export class CreatureProficiencyListComponent {
  @Input() proficiencies: CreatureListProficiency[];
  @Input() parentEnabled = true;

  constructor() { }

}
