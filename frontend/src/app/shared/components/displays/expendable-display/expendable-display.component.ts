import {Component, Input} from '@angular/core';
import {Item} from '../../../models/items/item';

@Component({
  selector: 'app-expendable-display',
  templateUrl: './expendable-display.component.html',
  styleUrls: ['./expendable-display.component.scss']
})
export class ExpendableDisplayComponent {
  @Input() item: Item;

  constructor() { }

}
