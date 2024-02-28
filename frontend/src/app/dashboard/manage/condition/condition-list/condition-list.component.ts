import {Component} from '@angular/core';
import {ConditionService} from '../../../../core/services/attributes/condition.service';

@Component({
  selector: 'app-condition-list',
  templateUrl: './condition-list.component.html',
  styleUrls: ['./condition-list.component.scss']
})
export class ConditionListComponent {
  loading = true;

  constructor(
    public conditionService: ConditionService
  ) { }
}
