import {Component, Input} from '@angular/core';
import {Item} from '../../models/items/item';

@Component({
  selector: 'app-weight-configuration',
  templateUrl: './weight-configuration.component.html',
  styleUrls: ['./weight-configuration.component.scss']
})
export class WeightConfigurationComponent {
  @Input() item: Item;
  @Input() editing = false;

  constructor() { }

  weightChange(input): void {
    this.item.weight = parseInt(input.value, 10);
  }
}
