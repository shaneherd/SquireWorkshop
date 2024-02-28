import {Component, Input} from '@angular/core';
import {Item} from '../../../models/items/item';

@Component({
  selector: 'app-cost-display',
  templateUrl: './cost-display.component.html',
  styleUrls: ['./cost-display.component.scss']
})
export class CostDisplayComponent {
  @Input() item: Item;

  constructor() { }

}
