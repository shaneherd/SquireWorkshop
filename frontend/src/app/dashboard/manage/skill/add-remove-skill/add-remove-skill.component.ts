import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {Skill} from '../../../../shared/models/attributes/skill';
import {SkillService} from '../../../../core/services/attributes/skill.service';

@Component({
  selector: 'app-add-remove-skill',
  templateUrl: './add-remove-skill.component.html',
  styleUrls: ['./add-remove-skill.component.scss']
})
export class AddRemoveSkillComponent implements OnInit {
  @Input() skill: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingSkill: Skill = null;

  constructor(
    private skillService: SkillService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.skillService.getSkill(this.skill.id).then((skill: Skill) => {
      this.viewingSkill = skill;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.skill);
  }
}
