import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuItem} from '../../../../shared/models/menuItem.model';
import {Condition} from '../../../../shared/models/attributes/condition';
import {ConditionService} from '../../../../core/services/attributes/condition.service';

@Component({
  selector: 'app-add-remove-condition',
  templateUrl: './add-remove-condition.component.html',
  styleUrls: ['./add-remove-condition.component.scss']
})
export class AddRemoveConditionComponent implements OnInit {
  @Input() condition: MenuItem;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  loading = true;
  viewingCondition: Condition = null;

  constructor(
    private conditionService: ConditionService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.conditionService.getCondition(this.condition.id).then((condition: Condition) => {
      this.viewingCondition = condition;
      this.loading = false;
    });
  }

  close(): void {
    this.cancel.emit();
  }

  continue(): void {
    this.save.emit(this.condition);
  }
}
