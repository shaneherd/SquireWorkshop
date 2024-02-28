import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatSliderChange} from '@angular/material/slider';

@Component({
  selector: 'app-slider-input',
  templateUrl: './slider-input.component.html',
  styleUrls: ['./slider-input.component.scss']
})
export class SliderInputComponent {
  @Input() min = 0;
  @Input() max = 0;
  @Input() step = 1;
  @Input() value = 0;
  @Input() displayMax = true;
  @Output() valueChange = new EventEmitter<number>();

  constructor() { }

  sliderChange(event: MatSliderChange): void {
    this.valueChange.emit(event.value);
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  onValueChange(input): void {
    const value = parseInt(input.value, 10);
    this.valueChange.emit(value);
  }

}
