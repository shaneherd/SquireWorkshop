import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-quantity-display',
  templateUrl: './quantity-display.component.html',
  styleUrls: ['./quantity-display.component.scss']
})
export class QuantityDisplayComponent {
  @Input() quantity: number;
  @Input() expendable = false;
  @Input() alwaysDisplay = false;

  constructor() { }

}
