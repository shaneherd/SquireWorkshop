import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[appInputNumber]'
})
export class InputNumberDirective {
  @Input() minValue: number;
  @Input() maxValue: number;
  @Input() allowDecimal = false;
  @Output() valueChange = new EventEmitter();

  constructor(private el: ElementRef) {}

  @HostListener('change') inputChange(): void {
    const input = this.el.nativeElement;
    let value = input.value;
    if (value == null || value === '') {
      input.value = 0;
    } else {
      let changed = false;
      if (!this.allowDecimal) {
        const index = value.indexOf('.');
        if (index > -1) {
          value = value.substring(0, index);
          changed = true;
        }
      }

      let num = parseFloat(value);
      if (num < this.minValue) {
        num = this.minValue;
        changed = true;
      } else if (num > this.maxValue) {
        num = this.maxValue;
        changed = true;
      }

      if (changed) {
        input.value = num;
      }
    }

    if (this.valueChange != null) {
      this.valueChange.emit(input);
    }
  }
}
