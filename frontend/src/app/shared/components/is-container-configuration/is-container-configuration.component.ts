import {Component, Input} from '@angular/core';
import {Item} from '../../models/items/item';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-is-container-configuration',
  templateUrl: './is-container-configuration.component.html',
  styleUrls: ['./is-container-configuration.component.scss']
})
export class IsContainerConfigurationComponent {
  @Input() item: Item;
  @Input() editing = false;

  constructor() { }

  containerChange(event: MatCheckboxChange): void {
    this.item.container = event.checked;
  }

  ignoreWeightChange(event: MatCheckboxChange): void {
    this.item.ignoreWeight = event.checked;
  }
}
