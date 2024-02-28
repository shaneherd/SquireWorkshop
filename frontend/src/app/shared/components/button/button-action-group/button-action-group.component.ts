import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonActionGroup} from '../../../models/button/button-action-group';
import {ButtonAction} from '../../../models/button/button-action';

@Component({
  selector: 'app-button-action-group',
  templateUrl: './button-action-group.component.html',
  styleUrls: ['./button-action-group.component.scss']
})
export class ButtonActionGroupComponent {
  @Input() group: ButtonActionGroup;
  @Output() onClick = new EventEmitter<ButtonAction>();

  constructor() { }

  buttonClick(action: ButtonAction): void {
    this.onClick.emit(action);
  }

}
