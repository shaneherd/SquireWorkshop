import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Condition} from '../../../../shared/models/attributes/condition';
import {CreatureService} from '../../../../core/services/creatures/creature.service';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ListObject} from '../../../../shared/models/list-object';
import {Creature} from '../../../../shared/models/creatures/creature';

@Component({
  selector: 'app-condition-configuration',
  templateUrl: './condition-configuration.component.html',
  styleUrls: ['./condition-configuration.component.scss']
})
export class ConditionConfigurationComponent implements OnInit {
  @Input() condition: Condition;
  @Input() creature: Creature;
  @Output() save = new EventEmitter();
  @Output() close = new EventEmitter();
  originalActive = false;
  immune = false;

  constructor(
    private creatureService: CreatureService
  ) { }

  ngOnInit() {
    this.originalActive = this.creatureService.isConditionActive(this.condition, this.creature);
    this.immune = this.creatureService.isConditionImmune(this.condition, this.creature);
  }

  conditionChange(event: MatCheckboxChange): void {
    this.immune = event.checked;
  }

  saveCondition(): void {
    this.creatureService.updateConditionImmunity(this.creature.id, this.condition, this.immune).then((conditionImmunities: ListObject[]) => {
      this.creature.conditionImmunities = conditionImmunities;
      this.save.emit();
    });
  }

  closeDetails(): void {
    if (this.close != null) {
      this.close.emit();
    }
  }
}
