import {Component, Input} from '@angular/core';
import {Skill} from '../../../../shared/models/attributes/skill';

@Component({
  selector: 'app-skill-details',
  templateUrl: './skill-details.component.html',
  styleUrls: ['./skill-details.component.scss']
})
export class SkillDetailsComponent {
  @Input() skill: Skill;

  constructor() { }
}
