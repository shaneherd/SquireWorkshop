import {Component, Input} from '@angular/core';
import {Item} from '../../../models/items/item';

@Component({
  selector: 'app-item-type-display',
  templateUrl: './item-type-display.component.html',
  styleUrls: ['./item-type-display.component.scss']
})
export class ItemTypeDisplayComponent {
  @Input() item: Item;
  @Input() class = '';

  constructor() { }

}
