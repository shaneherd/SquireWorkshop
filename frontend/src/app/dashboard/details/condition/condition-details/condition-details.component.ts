import {Component, Input, OnInit} from '@angular/core';
import {Condition} from '../../../../shared/models/attributes/condition';
import {ConnectingConditionCollection} from '../../../../shared/models/connecting-condition-collection';
import {ConditionService} from '../../../../core/services/attributes/condition.service';

@Component({
  selector: 'app-condition-details',
  templateUrl: './condition-details.component.html',
  styleUrls: ['./condition-details.component.scss']
})
export class ConditionDetailsComponent implements OnInit {
  @Input() condition: Condition;

  connectingConditionCollection = new ConnectingConditionCollection();

  constructor(
    private conditionService: ConditionService
  ) { }

  ngOnInit() {
    this.conditionService.initializeConnectingConditionConfigurations(this.condition).then((collection: ConnectingConditionCollection) => {
      this.connectingConditionCollection = collection;
    });
  }

}
