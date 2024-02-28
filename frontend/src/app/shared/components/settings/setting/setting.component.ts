import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent {
  @Input() checked = false;
  @Input() label = '';
  @Input() tooltip = '';
  @Output() change = new EventEmitter();

  constructor() { }

  onChange(event: MatCheckboxChange): void {
    this.change.emit(event);
  }

}
