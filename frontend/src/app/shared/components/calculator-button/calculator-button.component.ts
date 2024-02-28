import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-calculator-button',
  templateUrl: './calculator-button.component.html',
  styleUrls: ['./calculator-button.component.scss']
})
export class CalculatorButtonComponent {
  @Input() disabled = false;
  @Input() clickable = true;

  pressed = false;

  constructor() { }

  mousedown(): void {
    if (!this.disabled && this.clickable) {
      this.pressed = true;
    }
  }

  mouseup(): void {
    this.pressed = false;
  }
}
