import {Component, Input} from '@angular/core';
import {ConnectingConditionCollection} from '../../../../shared/models/connecting-condition-collection';
import {ConnectingConditionCollectionItem} from '../../../../shared/models/connecting-condition-collection-item';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ListObject} from '../../../../shared/models/list-object';

@Component({
  selector: 'app-connecting-conditions-configuration',
  templateUrl: './connecting-conditions-configuration.component.html',
  styleUrls: ['./connecting-conditions-configuration.component.scss']
})
export class ConnectingConditionsConfigurationComponent {
  @Input() editing: boolean;
  @Input() loading: boolean;
  @Input() connectingConditions: ListObject[] = [];
  @Input() connectingConditionsCollection: ConnectingConditionCollection;

  constructor() { }

  connectingChange(event: MatCheckboxChange, item: ConnectingConditionCollectionItem): void {
    item.checked = event.checked;
  }
}
