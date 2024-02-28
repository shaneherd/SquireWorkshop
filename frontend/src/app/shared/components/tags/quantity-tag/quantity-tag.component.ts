import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-quantity-tag',
  templateUrl: './quantity-tag.component.html',
  styleUrls: ['./quantity-tag.component.scss']
})
export class QuantityTagComponent {
  @Input() quantity = 0;
  @Input() maxValue = 99999999;
  @Input() alwaysShowQuantity = false;

  constructor() { }

}
