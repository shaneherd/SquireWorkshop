import {Component} from '@angular/core';
import {SkillService} from '../../../../core/services/attributes/skill.service';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss']
})
export class SkillListComponent {
  loading = true;

  constructor(
    public skillService: SkillService
  ) { }
}
