import {Component, Input} from '@angular/core';
import {Item} from '../../models/items/item';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-is-expendable-configuration',
  templateUrl: './is-expendable-configuration.component.html',
  styleUrls: ['./is-expendable-configuration.component.scss']
})
export class IsExpendableConfigurationComponent {
  @Input() item: Item;
  @Input() editing = false;

  constructor() { }

  expendableChange(event: MatCheckboxChange): void {
    this.item.expendable = event.checked;
  }

}
