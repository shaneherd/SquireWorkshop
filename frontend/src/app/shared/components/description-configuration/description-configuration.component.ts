import {Component, Input} from '@angular/core';
import {Item} from '../../models/items/item';

@Component({
  selector: 'app-description-configuration',
  templateUrl: './description-configuration.component.html',
  styleUrls: ['./description-configuration.component.scss']
})
export class DescriptionConfigurationComponent {
  @Input() item: Item;
  @Input() editing = false;
  @Input() maxLength = 1000;

  constructor() {
  }
}

